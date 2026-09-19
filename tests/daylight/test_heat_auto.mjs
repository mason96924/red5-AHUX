// Auto blind control — ported from red5-elc floor.html into heat-auto.js.
//
// These checks cover the four failures red5-elc hit on live sites, each of
// which left the loop doing nothing and saying nothing:
//   * glass owned by no room, so Auto never had a lux reading to act on
//   * unowned glass that could be opened but never closed
//   * Auto enrolment that defaulted to "excluded" and was invisible
//   * a close deadband that rejected every correction near the shut end
//
// Run: node tests/daylight/test_heat_auto.mjs
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', '..',
  'frontend', 'public', 'js');

// The modules are browser scripts that hang exports off `window`.
const sandbox = { console, Date, Math, Number, JSON, Map, Set, setTimeout,
  clearTimeout, setInterval, clearInterval };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
createContext(sandbox);

// sun-path.js also holds React overlays written in JSX, which Babel compiles
// at build time, so the raw file cannot be evaluated here. Pull out just the
// plain-JS helpers Auto depends on, brace-matched by name.
function extractWindowFn(src, name) {
  const start = src.indexOf(`window.${name} = function`);
  if (start < 0) throw new Error(`${name} not found in sun-path.js`);
  let depth = 0;
  for (let j = src.indexOf('{', start); j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}' && --depth === 0) return src.slice(start, j + 1) + ';';
  }
  throw new Error(`unbalanced braces in ${name}`);
}

const sunSrc = readFileSync(join(pub, 'sun-path.js'), 'utf8');
const reachLine = sunSrc.match(/window\.RED5_ROOM_REACH_PCT = [\d.]+;/);
if (!reachLine) throw new Error('RED5_ROOM_REACH_PCT not found in sun-path.js');
const geometry = [reachLine[0]].concat(
  ['red5SolarPosition', 'red5PointInPolygon', 'red5PolygonArea',
   'red5FindContainingRoom', 'red5RoomEdgeDistance', 'red5RoomForWindow',
   'red5PlanCardinalBasis', 'red5PlanSunVectors']
    .map(n => extractWindowFn(sunSrc, n))).join('\n');

runInContext(readFileSync(join(pub, 'blind-types.js'), 'utf8'), sandbox,
  { filename: 'blind-types.js' });
runInContext(geometry, sandbox, { filename: 'sun-path-geometry.js' });
runInContext(readFileSync(join(pub, 'heat-auto.js'), 'utf8'), sandbox,
  { filename: 'heat-auto.js' });
const heat = sandbox.red5HeatAuto;

let failures = 0;
const check = (cond, label, detail) => {
  console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail ? ` — ${detail}` : ''));
  if (!cond) failures++;
};

// ---------------------------------------------------------------- ownership
console.log('1. which room owns a window');
{
  const room = { id: 'r1', name: 'Room 1', type: 'office',
    vertices: [[0, 0], [20, 0], [20, 20], [0, 20]] };
  const far = { id: 'r2', name: 'Far', type: 'office',
    vertices: [[60, 60], [80, 60], [80, 80], [60, 80]] };
  const rooms = [room, far];
  const own = w => sandbox.red5RoomForWindow(w, rooms);
  const reach = sandbox.RED5_ROOM_REACH_PCT;

  // A window centre lies ON the wall it is cut into, so plain containment
  // is a coin flip there.
  check(own({ x: 10, y: 20, angle_deg: 0, length: 4 }) === room,
        'glass sitting exactly on the outline belongs to the room');
  // Traced plans leave a perimeter strip between facade and room outline.
  check(own({ x: 10, y: 20 + reach - 1, angle_deg: 0, length: 4 }) === room,
        `glass ${reach - 1}% outside an inset outline still belongs to it`);
  check(own({ x: 10, y: 20 + reach + 1, angle_deg: 0, length: 4 }) === null,
        `glass beyond ${reach}% of the plate stays unowned`);
  check(own({ x: 10, y: 10, angle_deg: 0, length: 4 }) === room,
        'a window inside a room is unaffected');

  const near = { id: 'r3', name: 'Near', type: 'office',
    vertices: [[0, 22], [20, 22], [20, 40], [0, 40]] };
  check(sandbox.red5RoomForWindow({ x: 10, y: 21.4, angle_deg: 0, length: 4 },
        [room, near]) === near,
        'the nearer outline wins when two are in reach');
}

// ------------------------------------------------------------- enrolment
console.log('2. Auto is opt-out');
{
  check(heat.inAuto({ id: 'traced' }) === true,
        'a window with no flag takes part');
  check(heat.inAuto({ id: 'on', heat_auto: true }) === true,
        'an enrolled window takes part');
  check(heat.inAuto({ id: 'off', heat_auto: false }) === false,
        'only an explicit false excludes glass');
}

// ------------------------------------------------------------ lux bands
console.log('3. comfort bands');
{
  const office = heat.roomLuxBand({ type: 'office' });
  check(office.min === 500 && office.max === 750,
        'office reads 500-750 lx', JSON.stringify(office));
  const corridor = heat.roomLuxBand({ type: 'corridor' });
  check(corridor.min === 100 && corridor.max === 200,
        'corridor reads 100-200 lx', JSON.stringify(corridor));
  const pinned = heat.roomLuxBand(
    { type: 'office', lux_override: true, min_lux: 200, max_lux: 400 });
  check(pinned.min === 200 && pinned.max === 400,
        'a hand-pinned band wins over the category default');
  const stored = heat.roomLuxBand({ type: 'office', min_lux: 200, max_lux: 400 });
  check(stored.min === 500,
        'stored lux without lux_override does NOT override the default',
        JSON.stringify(stored));
  const degenerate = heat.roomLuxBand(
    { type: 'office', lux_override: true, min_lux: 400, max_lux: 100 });
  check(degenerate.max > degenerate.min,
        'a zero-width band is widened so Auto has somewhere to settle',
        JSON.stringify(degenerate));
}

// ------------------------------------------------------- the control loop
// A room along the top of the plate, its glass on the north wall so the
// inward normal points +y. Plan sun vectors put azimuth 0 at (0, -1), which
// is the direction that lights such a window.
//
// Rooms are memoised by name and windows by id, and a moved room goes quiet
// for 40 s, so every case below needs its own names or the next tick is
// suppressed by the previous one's dwell.
let caseNo = 0;
function makeFloor(windows, roomOverrides) {
  caseNo++;
  return {
    id: 'F' + caseNo,
    rooms: [Object.assign({
      id: 'r' + caseNo, name: 'Room ' + caseNo, type: 'office',
      vertices: [[0, 0], [60, 0], [60, 30], [0, 30]],
    }, roomOverrides || {})],
    windows: windows.map(w => Object.assign({}, w, { id: w.id + '-' + caseNo })),
  };
}

const BRIGHT = { sun: { elevation: 55, azimuth: 0 }, cloudCover: 0 };
const DIM = { sun: { elevation: 6, azimuth: 0 }, cloudCover: 90 };

function bindFloor(floor, sunState) {
  const patches = [];
  heat.bind({
    getFloors: () => [floor],
    getSunState: () => sunState || BRIGHT,
    getLatLon: () => ({ lat: -33.87, lon: 151.21 }),
    getNorthOffset: () => 0,
    patch: (floorId, windowId, fields) => {
      patches.push({ windowId, fields });
      const w = (floor.windows || []).find(x => String(x.id) === String(windowId));
      if (w) Object.assign(w, fields);
    },
  });
  return patches;
}

const glass = (id, openPct, extra) => Object.assign({
  id: id,
  x: 30, y: 0, length: 20, angle_deg: 0,
  blind_type: 'roller',
  sill_height_m: 1.0, head_height_m: 2.2,
  blind_level: (100 - openPct) / 100,
}, extra || {});

const openOf = w => Math.round((1 - w.blind_level) * 100);

console.log('4. a room over its ceiling trims its blinds');
{
  const floor = makeFloor([glass('w1', 100)]);
  bindFloor(floor);
  const before = openOf(floor.windows[0]);
  heat.tick();
  const after = openOf(floor.windows[0]);
  check(after < before, `wide-open glass closes (${before}% → ${after}%)`);
}

console.log('5. the stall near the shut end is gone');
{
  // The ELCX case: the room's only glass is barely open, the room is still
  // over its ceiling, and every correction left to it is a 1-4% move.
  const floor = makeFloor([glass('w1', 5)], { type: 'corridor' });
  bindFloor(floor);
  const lux = heat.roomDaylightLux(floor.rooms[0], floor, floor.rooms);
  const band = heat.roomLuxBand(floor.rooms[0]);
  heat.tick();
  const after = openOf(floor.windows[0]);
  check(lux > band.max, `the room is over its ceiling (${Math.round(lux)} lx > ${band.max})`);
  check(after < 5, `glass at 5% still closes further (now ${after}%)`);
}

console.log('6. a dark room opens its blinds');
{
  const floor = makeFloor([glass('w1', 0)]);
  bindFloor(floor, DIM);
  heat.tick();
  check(openOf(floor.windows[0]) > 0,
        `shut glass opens under a dim sky (now ${openOf(floor.windows[0])}%)`);
}

console.log('7. unowned glass can be closed, not only opened');
{
  // Far outside every outline: nothing owns it, so before the port it was
  // openable by a dark room but had no path back down.
  const floor = makeFloor([glass('owned', 50), glass('orphan', 100, { x: 30, y: 95 })]);
  bindFloor(floor);
  const orphan = floor.windows[1];
  check(sandbox.red5RoomForWindow(orphan, floor.rooms) === null,
        'the far window really is unowned');
  heat.tick();
  check(openOf(orphan) < 100,
        `an unowned window closes when the floor wants shade (now ${openOf(orphan)}%)`);
}

console.log('8. excluded glass is left alone');
{
  const floor = makeFloor([glass('w1', 100, { heat_auto: false })]);
  bindFloor(floor);
  heat.tick();
  check(openOf(floor.windows[0]) === 100,
        'a window with heat_auto false does not move');
}

console.log('9. the lux map names the cause when Auto cannot fix it');
{
  const floor = makeFloor([glass('manual', 100, { heat_auto: false })]);
  bindFloor(floor);
  const scored = heat.scoreRooms(floor);
  check(scored.length === 1, 'one room scored');
  const s = scored[0];
  check(/\d+-\d+ lx/.test(s.label), `the label carries the band (${s.label})`);
  check(s.manualLux > 0 && /non-Auto glass/.test(s.label),
        'an over-lit room blames the glass Auto may not touch', s.label);
}

console.log();
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log('all checks passed');

// =====================================================================
// AHU SIZING CHECK MODULE  (Red5 Studio V1.9, 2026-04)
// =====================================================================
// Pure-logic heuristic engine + JSX components for the Equipment Mapper
// "Sizing" tab.  Provides three views that share the same engine:
//   1. Inline collapsible card  — top of the sidebar in any config mode,
//      gives a real-time AHU sizing pulse based on the count of AHU
//      groups currently configured.
//   2. Sizing tab               — full multi-floor table, advanced
//      inputs (perimeter %, critical zones, tenants), heuristic math
//      breakdown, real-world reference table, compliance flags.
//   3. Sanity-Check modal       — lightweight on-demand overlay
//      triggered from anywhere, opens directly into the Sizing tab.
//
// Design rules:
//   * NO external state.  The engine is a pure function tree so unit
//     tests + console-pasting work without React.
//   * Compliance references are advisory only — every warning carries
//     a "consult licensed engineer" disclaimer in its long text.
//   * Loaded by equipment_mapper.html's existing module-loader pipeline
//     so it shares Babel/JSX scope with the main source.  Hence we use
//     plain JSX here (no `import React`) and expose the components on
//     `window` for the main app to pick up.
// =====================================================================

/* ---------- BUILDING TYPE PRESETS ---------------------------------- */
/* m2_per_ahu = floor area each AHU comfortably covers for the type.
   perimeter_default = typical perimeter % to seed the slider.
   notes = tooltip caption shown under the type dropdown.            */
window.RED5_BUILDING_TYPES = {
  office: {
    label: 'Office',
    m2_per_ahu: 2000,
    perimeter_default: 30,
    notes: 'Open-plan office, code-driven OA, uniform internal load.',
    code: ['ASHRAE 62.1', 'IBC smoke zones']
  },
  hospital: {
    label: 'Hospital / Healthcare',
    m2_per_ahu: 1200,
    perimeter_default: 25,
    notes: 'High OA cascade, infection-control zoning, ASHRAE 170 driven.',
    code: ['ASHRAE 170', 'CDC guidelines', 'IBC smoke zones']
  },
  hotel: {
    label: 'Hotel',
    m2_per_ahu: 2500,
    perimeter_default: 40,
    notes: 'Corridor make-up + in-room PTAC/FCU; AHU mostly serves common areas.',
    code: ['ASHRAE 62.1', 'IBC smoke zones']
  },
  lab: {
    label: 'Laboratory / Cleanroom',
    m2_per_ahu: 800,
    perimeter_default: 20,
    notes: 'Pressurization cascade, 100% OA, fume-hood-driven exhaust.',
    code: ['ASHRAE 110', 'NIH design guide', 'IBC smoke zones']
  },
  residential: {
    label: 'Residential (high-rise condo)',
    m2_per_ahu: 4000,
    perimeter_default: 50,
    notes: 'Make-up AHU per floor only; in-suite FCUs handle space cooling.',
    code: ['ASHRAE 62.2']
  },
  data_center: {
    label: 'Data Center',
    m2_per_ahu: 600,
    perimeter_default: 0,
    notes: 'Sensible-only cooling, hot/cold aisle containment, N+1 redundancy.',
    code: ['ASHRAE TC 9.9']
  },
  other: {
    label: 'Other / Mixed-use',
    m2_per_ahu: 2000,
    perimeter_default: 30,
    notes: 'Generic 1 AHU per ~2000 m² baseline.',
    code: ['ASHRAE 62.1']
  }
};

/* IBC smoke-zone limit (most AHJs).  4180 m² ≈ 45 000 ft².             */
window.RED5_SMOKE_ZONE_LIMIT_M2 = 4180;

/* Reference projects table — surface validation against real builds.   */
window.RED5_REFERENCE_PROJECTS = [
  {name: 'Suburban Class-A Office', type: 'office',     area_m2: 2000, ahus: 1, note: 'Single perimeter AHU + VAV reheat'},
  {name: 'Trading-Floor (downtown)', type: 'office',    area_m2: 8000, ahus: 4, note: 'Quadrant AHUs (N/S/E/W façade split)'},
  {name: 'Mid-Size Hospital Floor',  type: 'hospital',  area_m2: 5000, ahus: 4, note: 'Med/Surg + ICU + 4 ORs (100% OA)'},
  {name: 'Boutique Hotel',           type: 'hotel',     area_m2: 1200, ahus: 1, note: 'Corridor make-up + room PTACs'},
  {name: 'Wet Lab Building',         type: 'lab',       area_m2: 3200, ahus: 4, note: 'Lab + admin pressurization cascade'},
  {name: 'Edge DC Pod',              type: 'data_center', area_m2: 1200, ahus: 4, note: '3+1 CRAH N+1 redundancy'},
  {name: 'Luxury Condo Tower Floor', type: 'residential', area_m2: 1800, ahus: 1, note: 'Code-driven OA only'}
];

/* ---------- HEURISTIC ENGINE (pure functions) ---------------------- */
/* Returns an object the UI can render directly.  Inputs:
     area_m2          number > 0
     building_type    key of RED5_BUILDING_TYPES
     perimeter_pct    0..100 (slider)
     critical_zones   integer ≥ 0  (each adds +1 AHU)
     tenants          integer ≥ 1  (each tenant gets ≥1 AHU)
     configured_ahus  integer ≥ 0  (current Red5 config count)
   Output:
     recommended      number (suggested AHU count)
     min_recommended  number (acceptable minimum)
     status           'ok' | 'borderline' | 'undersized' | 'oversized'
     ratio            configured / recommended
     breakdown        array of {label, value} contribution rows
     compliance       array of {code, severity, message}            */
window.red5SizingCalc = function red5SizingCalc(opts){
  var BT = window.RED5_BUILDING_TYPES;
  var t  = BT[opts.building_type] || BT.other;
  var area = Math.max(0, +opts.area_m2 || 0);
  var perim = Math.max(0, Math.min(100, +opts.perimeter_pct || 0));
  var crit = Math.max(0, parseInt(opts.critical_zones || 0, 10));
  var tenants = Math.max(1, parseInt(opts.tenants || 1, 10));
  var configured = Math.max(0, parseInt(opts.configured_ahus || 0, 10));

  var base = Math.ceil(area / t.m2_per_ahu) || 0;
  var perimAdder = perim > 30 ? 1 : 0;
  var critAdder = crit;                              // 1 AHU per critical zone
  var tenantAdder = Math.max(0, tenants - 1);        // baseline already covers 1
  var smokeAdder = area > window.RED5_SMOKE_ZONE_LIMIT_M2
    ? Math.ceil(area / window.RED5_SMOKE_ZONE_LIMIT_M2) - 1
    : 0;

  var recommended = base + perimAdder + critAdder + tenantAdder + smokeAdder;
  if (recommended < 1 && area > 0) recommended = 1;
  var minRecommended = Math.max(1, Math.ceil(recommended * 0.7));
  var maxReasonable  = Math.ceil(recommended * 1.6);

  var status = 'ok';
  if (configured === 0 || area === 0) {
    status = 'unknown';
  } else if (configured < minRecommended) {
    status = 'undersized';
  } else if (configured < recommended) {
    status = 'borderline';
  } else if (configured > maxReasonable) {
    status = 'oversized';
  }

  var breakdown = [
    {label: 'Base ⌈' + area + ' m² ÷ ' + t.m2_per_ahu + ' m²/AHU⌉', value: base},
    {label: 'Perimeter > 30 % adder',                                value: perimAdder},
    {label: 'Critical-zone adder (' + crit + ')',                    value: critAdder},
    {label: 'Multi-tenant adder (' + tenants + ' tenants)',          value: tenantAdder},
    {label: 'IBC smoke-zone split (> ' + window.RED5_SMOKE_ZONE_LIMIT_M2 + ' m²)', value: smokeAdder},
    {label: 'TOTAL RECOMMENDED',                                     value: recommended, total: true}
  ];

  var compliance = [];
  if (opts.building_type === 'hospital') {
    compliance.push({
      code: 'ASHRAE 170',
      severity: 'info',
      message: 'Hospital: verify each zone\u2019s minimum OA-changes/hr per Table 7.1 (e.g., OR \u2265 20 ACH, AII \u2265 12 ACH). Each isolation room typically demands its own 100 % OA AHU.'
    });
  }
  if (opts.building_type === 'lab') {
    compliance.push({
      code: 'ASHRAE 110 / NIH',
      severity: 'info',
      message: 'Lab: confirm fume-hood face-velocity 0.5 m/s and pressurization cascade \u22655 Pa between zones.'
    });
  }
  if (opts.building_type === 'office' || opts.building_type === 'hotel') {
    compliance.push({
      code: 'ASHRAE 62.1',
      severity: 'info',
      message: 'Verify Vbz minimum OA per Table 6-1 for occupancy classification.'
    });
  }
  if (smokeAdder > 0) {
    compliance.push({
      code: 'IBC \u00a7 909.5 / NFPA 92',
      severity: 'warn',
      message: 'Floor area exceeds typical 4180 m² (45 000 ft²) smoke-zone limit \u2192 split required across ' + (smokeAdder + 1) + ' smoke compartments. Each compartment normally serviced by its own AHU to prevent cross-contamination during a fire event.'
    });
  }
  if (status === 'undersized') {
    compliance.push({
      code: 'Engineering Risk',
      severity: 'crit',
      message: 'Configured AHU count (' + configured + ') is below the lower-bound recommendation (' + minRecommended + '). Likely under-zoned: expect comfort complaints, IAQ shortfalls, and difficult commissioning. CONSULT A LICENSED MECHANICAL ENGINEER.'
    });
  }
  if (status === 'oversized') {
    compliance.push({
      code: 'Cost / Maintenance',
      severity: 'warn',
      message: 'Configured AHU count (' + configured + ') is well above the recommended (' + recommended + '). Capital cost \u2191, maintenance burden \u2191, ductwork complexity \u2191. Verify the additional units are justified by zoning requirements.'
    });
  }

  return {
    recommended: recommended,
    min_recommended: minRecommended,
    max_reasonable: maxReasonable,
    status: status,
    ratio: recommended > 0 ? configured / recommended : 0,
    breakdown: breakdown,
    compliance: compliance,
    type: t
  };
};

/* ---------- SHARED UI HELPERS ------------------------------------- */
window.red5SizingStatusPill = function(status){
  var map = {
    ok:         {bg:'bg-emerald-600', text:'OK',          dot:'\u2705'},
    borderline: {bg:'bg-amber-500',   text:'BORDERLINE',  dot:'\u26a0'},
    undersized: {bg:'bg-rose-600',    text:'UNDER-SIZED', dot:'\u274c'},
    oversized:  {bg:'bg-violet-500',  text:'OVER-SIZED',  dot:'\ud83d\udd35'},
    unknown:    {bg:'bg-slate-600',   text:'NEED INPUT',  dot:'\u2014'}
  };
  return map[status] || map.unknown;
};

/* ---------- INLINE COLLAPSIBLE CARD COMPONENT --------------------- */
/* Top-of-sidebar real-time pulse.  Simplified inputs only — area +
   building type + current configured count.  Always visible; clicking
   the header collapses/expands the body.                              */
window.SizingInlineCard = function SizingInlineCard(props){
  var configuredAhus = props.configuredAhus || 0;
  var stored = (function(){
    try { return JSON.parse(localStorage.getItem('red5SizingState') || '{}'); }
    catch(e){ return {}; }
  })();
  var [open, setOpen]               = React.useState(stored.open !== false);
  var [areaM2, setAreaM2]           = React.useState(stored.area_m2 || 2000);
  var [bt, setBt]                   = React.useState(stored.building_type || 'office');

  React.useEffect(function(){
    localStorage.setItem('red5SizingState', JSON.stringify({
      open: open, area_m2: areaM2, building_type: bt,
      perimeter_pct: stored.perimeter_pct, critical_zones: stored.critical_zones,
      tenants: stored.tenants
    }));
  }, [open, areaM2, bt]);

  var calc = window.red5SizingCalc({
    area_m2: areaM2, building_type: bt,
    perimeter_pct: stored.perimeter_pct, critical_zones: stored.critical_zones,
    tenants: stored.tenants, configured_ahus: configuredAhus
  });
  var pill = window.red5SizingStatusPill(calc.status);
  var typeLabel = window.RED5_BUILDING_TYPES[bt].label;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden mb-2" data-testid="sizing-inline-card">
      <button
        onClick={function(){ setOpen(!open); }}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-900 transition-colors"
        data-testid="sizing-inline-toggle"
      >
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">AHU Sizing Check</span>
          <span className={'px-1.5 py-0.5 rounded text-white text-[7px] font-black tracking-wider ' + pill.bg}>
            {pill.dot} {pill.text}
          </span>
        </div>
        <span className="text-slate-500 text-[10px]">{open ? '\u25BC' : '\u25B6'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 space-y-2 text-[10px]">
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">Floor area (m²)</span>
              <input
                type="number" min="0" step="100" value={areaM2}
                onChange={function(e){ setAreaM2(+e.target.value || 0); }}
                className="w-full mt-0.5 px-2 py-1 bg-slate-900 border border-slate-700 text-cyan-300 rounded font-mono"
                data-testid="sizing-area-input"
              />
            </label>
            <label className="block">
              <span className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">Building type</span>
              <select
                value={bt}
                onChange={function(e){ setBt(e.target.value); }}
                className="w-full mt-0.5 px-1 py-1 bg-slate-900 border border-slate-700 text-cyan-300 rounded font-mono"
                data-testid="sizing-type-select"
              >
                {Object.keys(window.RED5_BUILDING_TYPES).map(function(k){
                  return <option key={k} value={k}>{window.RED5_BUILDING_TYPES[k].label}</option>;
                })}
              </select>
            </label>
          </div>
          <div className="bg-slate-900 rounded px-2 py-1.5 flex items-center justify-between">
            <div>
              <div className="text-[8px] text-slate-500 uppercase tracking-wider">Configured / Recommended</div>
              <div className="font-mono text-sm">
                <span className="text-emerald-300">{configuredAhus}</span>
                <span className="text-slate-600 mx-1">/</span>
                <span className="text-cyan-300">{calc.recommended}</span>
                <span className="text-slate-500 text-[9px] ml-2">(min {calc.min_recommended})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-slate-500 uppercase tracking-wider">{typeLabel}</div>
              <div className="text-[9px] text-slate-400">{areaM2} m² / {calc.type.m2_per_ahu} m² per AHU</div>
            </div>
          </div>
          {calc.status !== 'ok' && calc.status !== 'unknown' && (
            <div className="bg-slate-900 border-l-2 border-amber-500 px-2 py-1.5 text-[9px] text-amber-300 leading-snug" data-testid="sizing-recommendation">
              {calc.status === 'undersized' && 'Add ' + (calc.recommended - configuredAhus) + ' more AHU' + (calc.recommended - configuredAhus > 1 ? 's' : '') + ' to reach the recommended count.'}
              {calc.status === 'borderline' && 'Acceptable but tight — consider adding 1 more AHU for headroom.'}
              {calc.status === 'oversized' && 'You\u2019re over-zoned by ' + (configuredAhus - calc.max_reasonable) + ' AHU(s) — review whether all are required.'}
            </div>
          )}
          <button
            onClick={function(){ if (props.onOpenFullCheck) props.onOpenFullCheck(); }}
            className="w-full py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[9px] font-black uppercase tracking-widest transition-all"
            data-testid="sizing-open-full-btn"
          >
            Open Sanity Check \u2192
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- FULL SIZING TAB COMPONENT ----------------------------- */
/* Multi-floor table + advanced inputs + heuristic math + reference   */
/* projects + compliance flags.  Renders inside the main canvas area. */
window.SizingTab = function SizingTab(props){
  var configuredAhus = props.configuredAhus || 0;
  var stored = (function(){
    try { return JSON.parse(localStorage.getItem('red5SizingFullState') || '{}'); }
    catch(e){ return {}; }
  })();

  var [floors, setFloors]           = React.useState(stored.floors && stored.floors.length ? stored.floors : [
    {id:1, name:'Typical Floor', area_m2:2000, building_type:'office', perimeter_pct:30, critical_zones:0, tenants:1}
  ]);
  var [advancedOpen, setAdvancedOpen] = React.useState(true);

  React.useEffect(function(){
    localStorage.setItem('red5SizingFullState', JSON.stringify({floors: floors}));
  }, [floors]);

  function update(idx, patch){
    setFloors(prev => prev.map(function(f,i){ return i===idx ? Object.assign({}, f, patch) : f; }));
  }
  function addFloor(){
    setFloors(prev => prev.concat([{
      id: Date.now(), name:'Floor ' + (prev.length+1), area_m2:2000, building_type:'office',
      perimeter_pct:30, critical_zones:0, tenants:1
    }]));
  }
  function removeFloor(idx){
    setFloors(prev => prev.filter(function(_,i){ return i!==idx; }));
  }

  var perFloor = floors.map(function(f){
    return {floor: f, calc: window.red5SizingCalc(Object.assign({configured_ahus:0}, f))};
  });
  var totals = perFloor.reduce(function(acc, row){
    acc.area += row.floor.area_m2;
    acc.recommended += row.calc.recommended;
    acc.min_recommended += row.calc.min_recommended;
    return acc;
  }, {area:0, recommended:0, min_recommended:0});

  var rollup = {
    area_m2: totals.area,
    building_type: floors[0] ? floors[0].building_type : 'office',
    perimeter_pct: 30, critical_zones: 0, tenants: 1,
    configured_ahus: configuredAhus
  };
  var rollCalc = window.red5SizingCalc(rollup);
  rollCalc.recommended = totals.recommended;
  rollCalc.min_recommended = totals.min_recommended;
  if (configuredAhus < totals.min_recommended) rollCalc.status = 'undersized';
  else if (configuredAhus < totals.recommended) rollCalc.status = 'borderline';
  else rollCalc.status = 'ok';
  var pill = window.red5SizingStatusPill(rollCalc.status);

  var allCompliance = [];
  perFloor.forEach(function(row){
    row.calc.compliance.forEach(function(c){
      var key = c.code + '|' + c.message;
      if (!allCompliance.some(function(x){ return (x.code+'|'+x.message)===key; })) {
        allCompliance.push(c);
      }
    });
  });

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-200 p-6 custom-scrollbar" data-testid="sizing-tab">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            <span className="text-cyan-400">AHU</span> Sizing &amp; Sanity Check
          </h1>
          <p className="text-[10px] text-slate-500 mt-1">
            Heuristic guidance for high-rise / institutional HVAC zoning.
            Advisory only \u2014 always confirm with a licensed mechanical engineer.
          </p>
        </div>
        <div className={'px-4 py-2 rounded-lg text-white font-black tracking-widest ' + pill.bg} data-testid="sizing-status-pill">
          {pill.dot} {pill.text}
        </div>
      </div>

      {/* ROLLUP */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider font-black">Total area</div>
          <div className="font-mono text-2xl text-cyan-300">{totals.area.toLocaleString()} <span className="text-[10px] text-slate-500">m²</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider font-black">Configured AHUs</div>
          <div className="font-mono text-2xl text-emerald-300">{configuredAhus}</div>
          <div className="text-[8px] text-slate-500 mt-0.5">in current Red5 config</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider font-black">Recommended</div>
          <div className="font-mono text-2xl text-cyan-300">{totals.recommended}</div>
          <div className="text-[8px] text-slate-500 mt-0.5">min {totals.min_recommended}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="text-[8px] text-slate-500 uppercase tracking-wider font-black">Delta</div>
          <div className={'font-mono text-2xl ' + (configuredAhus < totals.min_recommended ? 'text-rose-400' : configuredAhus < totals.recommended ? 'text-amber-400' : 'text-emerald-400')}>
            {(configuredAhus - totals.recommended) >= 0 ? '+' : ''}{configuredAhus - totals.recommended}
          </div>
          <div className="text-[8px] text-slate-500 mt-0.5">vs recommended</div>
        </div>
      </div>

      {/* FLOOR TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Per-floor breakdown</h2>
          <button
            onClick={addFloor}
            className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[9px] font-black uppercase tracking-widest"
            data-testid="sizing-add-floor-btn"
          >
            + Add Floor
          </button>
        </div>
        <table className="w-full text-[10px] font-mono">
          <thead className="text-[8px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left py-1 px-1">Name</th>
              <th className="text-right py-1 px-1">Area (m²)</th>
              <th className="text-left py-1 px-1">Type</th>
              <th className="text-right py-1 px-1">Perim %</th>
              <th className="text-right py-1 px-1">Crit zones</th>
              <th className="text-right py-1 px-1">Tenants</th>
              <th className="text-right py-1 px-1 text-cyan-300">→ AHUs</th>
              <th className="px-1"></th>
            </tr>
          </thead>
          <tbody>
            {perFloor.map(function(row, idx){
              var f = row.floor;
              return (
                <tr key={f.id} className="border-t border-slate-800 hover:bg-slate-950/50">
                  <td className="py-1 px-1">
                    <input value={f.name} onChange={function(e){ update(idx,{name:e.target.value}); }}
                      className="w-full bg-transparent border-b border-slate-700 text-slate-300 focus:border-cyan-500 focus:outline-none px-1"/>
                  </td>
                  <td className="py-1 px-1">
                    <input type="number" min="0" step="100" value={f.area_m2}
                      onChange={function(e){ update(idx,{area_m2:+e.target.value || 0}); }}
                      className="w-20 bg-transparent border-b border-slate-700 text-cyan-300 text-right focus:border-cyan-500 focus:outline-none px-1"/>
                  </td>
                  <td className="py-1 px-1">
                    <select value={f.building_type}
                      onChange={function(e){
                        var newT = e.target.value;
                        update(idx,{building_type:newT, perimeter_pct: window.RED5_BUILDING_TYPES[newT].perimeter_default});
                      }}
                      className="bg-slate-950 border border-slate-700 text-slate-300 rounded text-[9px] px-1 py-0.5">
                      {Object.keys(window.RED5_BUILDING_TYPES).map(function(k){
                        return <option key={k} value={k}>{window.RED5_BUILDING_TYPES[k].label}</option>;
                      })}
                    </select>
                  </td>
                  <td className="py-1 px-1">
                    <input type="number" min="0" max="100" step="5" value={f.perimeter_pct}
                      onChange={function(e){ update(idx,{perimeter_pct:+e.target.value || 0}); }}
                      className="w-12 bg-transparent border-b border-slate-700 text-amber-300 text-right focus:border-cyan-500 focus:outline-none px-1"/>
                  </td>
                  <td className="py-1 px-1">
                    <input type="number" min="0" step="1" value={f.critical_zones}
                      onChange={function(e){ update(idx,{critical_zones:+e.target.value || 0}); }}
                      className="w-12 bg-transparent border-b border-slate-700 text-amber-300 text-right focus:border-cyan-500 focus:outline-none px-1"/>
                  </td>
                  <td className="py-1 px-1">
                    <input type="number" min="1" step="1" value={f.tenants}
                      onChange={function(e){ update(idx,{tenants:+e.target.value || 1}); }}
                      className="w-12 bg-transparent border-b border-slate-700 text-amber-300 text-right focus:border-cyan-500 focus:outline-none px-1"/>
                  </td>
                  <td className="py-1 px-1 text-right text-cyan-300 font-bold">{row.calc.recommended}</td>
                  <td className="py-1 px-1 text-right">
                    {floors.length > 1 && (
                      <button onClick={function(){ removeFloor(idx); }}
                        className="text-rose-400 hover:text-rose-300 text-[10px]" title="Remove floor">✕</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-cyan-700">
            <tr>
              <td className="py-2 px-1 font-black uppercase text-cyan-400">Totals</td>
              <td className="py-2 px-1 text-right font-black text-cyan-300">{totals.area.toLocaleString()}</td>
              <td colSpan="4"></td>
              <td className="py-2 px-1 text-right font-black text-cyan-300">{totals.recommended}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* HEURISTIC MATH BREAKDOWN — show first floor's row by default */}
      {perFloor[0] && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">
            Heuristic math \u2014 {perFloor[0].floor.name}
          </h2>
          <div className="font-mono text-[11px] space-y-1">
            {perFloor[0].calc.breakdown.map(function(b, i){
              return (
                <div key={i} className={'flex justify-between ' + (b.total ? 'border-t border-slate-700 pt-1 mt-1 font-black text-cyan-300' : 'text-slate-400')}>
                  <span>{b.label}</span>
                  <span className="text-right w-16">{b.value >= 0 ? '+' + b.value : b.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COMPLIANCE FLAGS */}
      {allCompliance.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6" data-testid="sizing-compliance-section">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">Compliance reference</h2>
          <div className="space-y-2">
            {allCompliance.map(function(c, i){
              var sev = c.severity === 'crit' ? 'border-rose-500 text-rose-300 bg-rose-950/40'
                      : c.severity === 'warn' ? 'border-amber-500 text-amber-300 bg-amber-950/40'
                      : 'border-cyan-500 text-cyan-300 bg-cyan-950/40';
              return (
                <div key={i} className={'border-l-4 px-3 py-2 rounded-r ' + sev}>
                  <div className="text-[9px] font-black uppercase tracking-widest mb-0.5">{c.code}</div>
                  <div className="text-[10px] leading-relaxed">{c.message}</div>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] text-slate-500 mt-3 italic">
            ⚠ All compliance flags are heuristic-driven and advisory only. Final design decisions require a licensed mechanical engineer
            and review against the project\u2019s authority-having-jurisdiction (AHJ) requirements.
          </p>
        </div>
      )}

      {/* REFERENCE PROJECTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">Reference projects</h2>
        <table className="w-full text-[10px] font-mono">
          <thead className="text-[8px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left py-1">Project</th>
              <th className="text-left py-1">Type</th>
              <th className="text-right py-1">Area (m²)</th>
              <th className="text-right py-1">AHUs</th>
              <th className="text-left py-1 pl-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {window.RED5_REFERENCE_PROJECTS.map(function(p, i){
              return (
                <tr key={i} className="border-t border-slate-800 hover:bg-slate-950/50">
                  <td className="py-1 text-slate-300">{p.name}</td>
                  <td className="py-1 text-slate-400">{window.RED5_BUILDING_TYPES[p.type] ? window.RED5_BUILDING_TYPES[p.type].label : p.type}</td>
                  <td className="py-1 text-right text-cyan-300">{p.area_m2.toLocaleString()}</td>
                  <td className="py-1 text-right text-emerald-300 font-bold">{p.ahus}</td>
                  <td className="py-1 pl-3 text-slate-400">{p.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

"""
weather_service.py
==================
Weather location persistence + Open-Meteo archive history fetch + tomorrow's
forecast (using prior-year same-day data) + daily forecast-to-BACnet job.

Extracted from app.py on 2026-05-06 to keep the main script under the
embedded controller's per-file safe-write threshold.  Same plug-in pattern
as upload_service.py: app.py calls
    weather_service.register(app, ctx)
once during startup and the helpers + Flask routes get attached to the
caller's app instance.

Endpoints registered:
  GET  /api/weather-location
  POST /api/weather-location
  GET  /api/weather-history
  GET  /api/tomorrow-forecast
  GET  /api/forecast-config
  POST /api/forecast-config
  POST /api/forecast-write-now
"""
# Required SERVICE_CTX keys -- validated by app.py auto-discovery.
_service_dependencies = ['DATA_ROOT']
import os
import math
import json
import time
import datetime
import threading
import urllib.request
import urllib.parse
import urllib.error

from flask import jsonify, request


# DATA_ROOT is filled in by register().  All on-disk paths derive from it,
# so this module is portable across test setups that point /root/data
# elsewhere.
DATA_ROOT = None
WEATHER_LOC_PATH = None
FORECAST_CONFIG_PATH = None


# -----------------------------------------------------------------------------
# Weather location persistence -- stored on the controller so the selected city
# survives browser cache clears, different operator devices, etc.
# -----------------------------------------------------------------------------
WEATHER_LOC_PATH = os.path.join('/root/data/configs', 'weather_location.json')

def _coerce_loc(d):
    """Validate & normalize a single {lat, lon, name} dict. Returns None on bad input."""
    if not isinstance(d, dict):
        return None
    try:
        lat = float(d.get('lat'))
        lon = float(d.get('lon'))
    except (TypeError, ValueError):
        return None
    name = str(d.get('name') or '').strip()
    return {'lat': lat, 'lon': lon, 'name': name}

def _read_weather_state():
    """Load the on-controller weather state, migrating any legacy single-loc file."""
    if not os.path.isfile(WEATHER_LOC_PATH):
        return {'active': None, 'saved': [], 'default': None}
    try:
        with open(WEATHER_LOC_PATH, 'r') as f:
            data = json.load(f)
    except Exception:
        return {'active': None, 'saved': [], 'default': None}
    # Legacy format: bare {lat, lon, name}
    if isinstance(data, dict) and 'lat' in data and 'lon' in data and 'active' not in data and 'saved' not in data:
        active = _coerce_loc(data)
        return {'active': active, 'saved': [active] if active else [], 'default': None}
    if not isinstance(data, dict):
        return {'active': None, 'saved': [], 'default': None}
    active = _coerce_loc(data.get('active')) if data.get('active') is not None else None
    default = _coerce_loc(data.get('default')) if data.get('default') is not None else None
    raw_saved = data.get('saved') or []
    saved = []
    seen = set()
    if isinstance(raw_saved, list):
        for item in raw_saved:
            loc = _coerce_loc(item)
            if not loc:
                continue
            key = (round(loc['lat'], 4), round(loc['lon'], 4))
            if key in seen:
                continue
            seen.add(key)
            saved.append(loc)
    # Fresh-session fallback: when no `active` has been picked yet but the
    # operator has pinned a `default`, surface that as the active location.
    if not active and default:
        active = default
    return {'active': active, 'saved': saved, 'default': default}

def _write_weather_state(state):
    try:
        os.makedirs(os.path.dirname(WEATHER_LOC_PATH), exist_ok=True)
    except Exception:
        pass
    tmp = WEATHER_LOC_PATH + '.tmp'
    payload = json.dumps(state)
    # Write + fsync the file *and* its parent directory so the entry is
    # committed to flash, not just OS page cache. Embedded controllers using
    # buffered/overlay filesystems otherwise lose the data on a hard reset.
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
    try:
        os.write(fd, payload.encode('utf-8'))
        try:
            os.fsync(fd)
        except OSError:
            pass
    finally:
        os.close(fd)
    os.replace(tmp, WEATHER_LOC_PATH)
    try:
        dir_fd = os.open(os.path.dirname(WEATHER_LOC_PATH), os.O_DIRECTORY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except OSError:
        pass

def get_weather_location():
    """GET /api/weather-location -- return active / saved / default state.

    When the operator has not yet curated any custom locations
    (`saved == []`), seed the response with a small set of bundled
    demo cities so the dashboard + 3D WX modal never render an empty
    dropdown on a fresh controller.  As soon as the operator saves their
    first real location and POSTs back, the persisted `saved` array
    fully replaces these defaults -- the bundled list is a *starter*,
    not a permanent overlay.
    """
    state = _read_weather_state()
    if not state.get('saved'):
        state['saved'] = [
            {'name': 'Seoul, KR',    'lat': 37.5665, 'lon': 126.9780},
            {'name': 'Tokyo, JP',    'lat': 35.6762, 'lon': 139.6503},
            {'name': 'Singapore',    'lat':  1.3521, 'lon': 103.8198},
            {'name': 'New York, US', 'lat': 40.7128, 'lon': -74.0060},
            {'name': 'Seattle, US',  'lat': 47.6062, 'lon': -122.3321},
        ]
    return jsonify(state)

def set_weather_location():
    """Accepts either:
      • Legacy: {lat, lon, name}                                  → updates active, adds to saved
      • Full:   {active: {...}|null, saved: [...], default: ...}  → replaces full state.
        - `default` is the operator's pinned-on-fresh-session location.
        - Send `default: {lat, lon, name}` to pin, `null` to clear.
        - When `default` key is omitted, the existing pin is preserved.
    Returns the resulting persisted state.
    """
    try:
        body = request.get_json(silent=True) or {}
        # Detect format
        is_full = ('active' in body) or ('saved' in body) or ('default' in body)
        if is_full:
            existing = _read_weather_state()
            # Active + saved replace whatever is currently stored; default is
            # merged so a caller can update just one field without losing the
            # others (e.g., pinning a default from the 3D WX panel shouldn't
            # wipe the user's saved list).
            if 'active' in body:
                active = _coerce_loc(body.get('active')) if body.get('active') is not None else None
            else:
                active = existing.get('active')
            if 'saved' in body:
                saved = []
                seen = set()
                for item in (body.get('saved') or []):
                    loc = _coerce_loc(item)
                    if not loc:
                        continue
                    key = (round(loc['lat'], 4), round(loc['lon'], 4))
                    if key in seen:
                        continue
                    seen.add(key)
                    saved.append(loc)
            else:
                saved = list(existing.get('saved') or [])
            if 'default' in body:
                # null / empty dict / non-dict -> clear; {lat,lon,name} -> pin.
                default = _coerce_loc(body.get('default')) if body.get('default') else None
            else:
                default = existing.get('default')
            state = {'active': active, 'saved': saved, 'default': default}
        else:
            loc = _coerce_loc(body)
            if not loc:
                return jsonify({'success': False, 'error': 'lat/lon must be numeric'}), 400
            existing = _read_weather_state()
            saved = list(existing.get('saved') or [])
            key = (round(loc['lat'], 4), round(loc['lon'], 4))
            saved = [s for s in saved if (round(s['lat'], 4), round(s['lon'], 4)) != key]
            saved.insert(0, loc)
            state = {'active': loc, 'saved': saved[:20], 'default': existing.get('default')}
        _write_weather_state(state)
        return jsonify({'success': True, 'state': state})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def weather_history():
    import time as _time
    _t0 = _time.time()
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    year = request.args.get('year', '2025')
    force = request.args.get('force', '').lower() in ('1', 'true', 'yes')
    if not lat or not lon:
        return jsonify({'success': False, 'error': 'lat and lon required'}), 400

    # Normalize lat/lon for the cache key. open-meteos grid resolution is
    # ~0.1 deg  (~11 km), so 2 decimal places (~1.1 km) is more than enough -- and
    # using a fixed precision means the cache key is stable regardless of
    # how many decimals the caller sends (37.5665 vs 37.57 must hit the
    # same cache entry, otherwise every selection re-downloads from the net).
    try:
        lat_key = f"{round(float(lat), 2):.2f}"
        lon_key = f"{round(float(lon), 2):.2f}"
    except (TypeError, ValueError):
        return jsonify({'success': False, 'error': 'lat/lon must be numeric'}), 400

    cache_file = os.path.join('/root/data', 'configs', f'weather_{lat_key}_{lon_key}_{year}.json')

    # One-shot orphan sweep: at most once per Flask process, scan the configs
    # dir and delete any weather_*.json file that is incomplete (missing
    # `success`/`hourly`) or duplicates a canonical entry that already exists.
    # This automatically reclaims flash space after a code-format upgrade.
    global _wx_orphans_swept
    try:
        _wx_orphans_swept
    except NameError:
        _wx_orphans_swept = False
    if not _wx_orphans_swept:
        try:
            cfg_dir = os.path.dirname(cache_file)
            def _is_canonical_name(fn):
                """weather_<lat>_<lon>_<year>.json with 2-decimal lat/lon
                and 4-digit year. No regex — some controller deployment
                pipelines mangle backslashes/$ in raw strings."""
                if not fn.startswith('weather_') or not fn.endswith('.json'):
                    return False
                core = fn[len('weather_'):-len('.json')]
                parts = core.rsplit('_', 1)
                if len(parts) != 2:
                    return False
                coord, yr = parts
                if not (len(yr) == 4 and yr.isdigit()):
                    return False
                # coord = "<lat>_<lon>"; lon may be negative.
                bits = coord.split('_')
                if len(bits) != 2:
                    return False
                for p in bits:
                    if '.' not in p:
                        return False
                    intp, fracp = p.split('.', 1)
                    if len(fracp) != 2 or not fracp.isdigit():
                        return False
                    sign = ''
                    if intp.startswith('-'):
                        sign = '-'; intp = intp[1:]
                    if not intp.isdigit():
                        return False
                return True
            non_canonical = []
            for fn in os.listdir(cfg_dir):
                if not fn.startswith('weather_') or not fn.endswith('.json'):
                    continue
                if fn == 'weather_location.json':
                    continue
                if not _is_canonical_name(fn):
                    non_canonical.append(fn)
            for fn in non_canonical:
                fp = os.path.join(cfg_dir, fn)
                try:
                    with open(fp, 'r') as fh: d = json.load(fh)
                except Exception:
                    try: os.remove(fp)
                    except OSError: pass
                    continue
                # Keep only if it is a complete payload AND there is no canonical
                # already covering the same coordinates+year.
                if (isinstance(d, dict)
                        and d.get('success') is True
                        and isinstance(d.get('hourly'), list) and len(d['hourly']) > 0):
                    pass  # leave it; legacy migration will pick it up later
                else:
                    try: os.remove(fp)
                    except OSError: pass
        except OSError:
            pass
        _wx_orphans_swept = True

    def _is_complete_payload(d):
        """A cache hit is only valid if it has both daily AND hourly data and
        the success flag — older or partial files (e.g. daily-only from a
        previous code version) must be treated as misses, otherwise the
        frontend never receives hourly data."""
        return (isinstance(d, dict)
                and d.get('success') is True
                and isinstance(d.get('daily'), list) and len(d['daily']) > 0
                and isinstance(d.get('hourly'), list) and len(d['hourly']) > 0)

    def _find_legacy_cache():
        """Look for any pre-existing cache file for the same year whose lat/lon
        are within ±0.05° of the requested point (well within open-meteo's
        ~11 km grid). Renames it to the canonical key so it's reused
        permanently. This avoids re-downloading after a code change in how
        lat/lon are rounded (37.5665 → '37.56' vs '37.57' historically)."""
        try:
            req_lat = float(lat_key); req_lon = float(lon_key)
            cfg_dir = os.path.dirname(cache_file)
            for fn in os.listdir(cfg_dir):
                if not fn.startswith('weather_') or not fn.endswith(f'_{year}.json'):
                    continue
                if fn == os.path.basename(cache_file):
                    continue
                core = fn[len('weather_'):-len(f'_{year}.json')]
                # core is "<lat>_<lon>" (lon may be negative). Lat is always first
                # and never starts with - here for these grids; for safety try
                # both single split orientations.
                parts = core.split('_')
                if len(parts) < 2:
                    continue
                # Reconstruct: if there are 2 parts, lat=parts[0], lon=parts[1]
                # If 3 parts (negative number using -), join accordingly.
                try:
                    if len(parts) == 2:
                        f_lat, f_lon = float(parts[0]), float(parts[1])
                    elif len(parts) == 3 and parts[1] == '':
                        f_lat = float(parts[0]); f_lon = float('-' + parts[2])
                    elif len(parts) == 3 and parts[0] == '':
                        f_lat = float('-' + parts[1]); f_lon = float(parts[2])
                    else:
                        continue
                except ValueError:
                    continue
                if abs(f_lat - req_lat) <= 0.05 and abs(f_lon - req_lon) <= 0.05:
                    candidate = os.path.join(cfg_dir, fn)
                    try:
                        with open(candidate, 'r') as fh:
                            cached = json.load(fh)
                    except Exception:
                        continue
                    if _is_complete_payload(cached):
                        # Promote to canonical name so future lookups hit immediately.
                        try: os.replace(candidate, cache_file)
                        except OSError: pass
                        return cached
                    else:
                        # Stale / incomplete legacy entry -- clean it up so it
                        # does not shadow a future good cache.
                        try: os.remove(candidate)
                        except OSError: pass
        except OSError:
            pass
        return None

    # Decide if the cache is fresh enough to return without a network round-trip.
    # Past years are immutable -> cache forever. Current year grows daily -> only
    # treat the cache as fresh if it was written within the last 24 h.
    import datetime, time
    is_current_year = (str(year) == str(datetime.date.today().year))
    cache_fresh = False
    if os.path.isfile(cache_file) and not force:
        if not is_current_year:
            cache_fresh = True
        else:
            age = time.time() - os.path.getmtime(cache_file)
            cache_fresh = age < 24 * 3600

    if cache_fresh:
        try:
            with open(cache_file, 'r') as f:
                cached = json.load(f)
            if _is_complete_payload(cached):
                cached['_from_cache'] = True
                cached['_elapsed_ms'] = int((_time.time() - _t0) * 1000)
                print(f"[WX] {lat_key},{lon_key} yr={year} -> cache ({cached['_elapsed_ms']}ms)")
                return jsonify(cached)
            # If the canonical file exists but is partial/legacy, fall through
            # to legacy migration / re-fetch.
        except Exception:
            pass

    if not force:
        legacy = _find_legacy_cache()
        if legacy:
            legacy['_from_cache'] = True
            legacy['_migrated'] = True
            legacy['_elapsed_ms'] = int((_time.time() - _t0) * 1000)
            print(f"[WX] {lat_key},{lon_key} yr={year} -> legacy-cache ({legacy['_elapsed_ms']}ms)")
            return jsonify(legacy)

    # Fetch from Open-Meteo
    try:
        end_date = f'{year}-12-31'
        # Cap end_date to today for current/future years
        today_str = datetime.date.today().isoformat()
        if end_date > today_str:
            end_date = today_str
        params = urllib.parse.urlencode({
            'latitude': lat_key,
            'longitude': lon_key,
            'start_date': f'{year}-01-01',
            'end_date': end_date,
            'hourly': 'temperature_2m,relative_humidity_2m',
            'daily': 'weather_code',
            'timezone': 'auto'
        })
        url = f'https://archive-api.open-meteo.com/v1/archive?{params}'
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        
        hourly = data.get('hourly', {})
        times = hourly.get('time', [])
        temps = hourly.get('temperature_2m', [])
        rhs = hourly.get('relative_humidity_2m', [])
        
        # Extract daily weather codes
        daily_raw = data.get('daily', {})
        wc_dates = daily_raw.get('time', [])
        wc_codes = daily_raw.get('weather_code', [])
        weather_codes = {}
        for i in range(len(wc_dates)):
            weather_codes[wc_dates[i]] = wc_codes[i] if i < len(wc_codes) else None
        
        # Aggregate to daily: min, max, avg for temp and rh
        daily = []
        day_data = {}
        for i in range(len(times)):
            day = times[i][:10]
            if day not in day_data:
                day_data[day] = {'temps': [], 'rhs': []}
            if temps[i] is not None:
                day_data[day]['temps'].append(temps[i])
            if rhs[i] is not None:
                day_data[day]['rhs'].append(rhs[i])
        
        for day in sorted(day_data.keys()):
            d = day_data[day]
            if d['temps'] and d['rhs']:
                avg_t = sum(d['temps']) / len(d['temps'])
                avg_rh = sum(d['rhs']) / len(d['rhs'])
                # Compute enthalpy for each hourly reading to get min/max/avg
                h_values = []
                for ti, ri in zip(d['temps'], d['rhs']):
                    ps = 0.6108 * math.exp(17.27 * ti / (ti + 237.3))
                    pwi = (ri / 100) * ps
                    wi = 0.621945 * pwi / (101.325 - pwi) if (101.325 - pwi) > 0 else 0
                    h_values.append(1.006 * ti + wi * (2501 + 1.86 * ti))
                h_avg = sum(h_values) / len(h_values)
                daily.append({
                    'date': day,
                    'temp_min': round(min(d['temps']), 1),
                    'temp_max': round(max(d['temps']), 1),
                    'temp_avg': round(avg_t, 1),
                    'rh_min': round(min(d['rhs'])),
                    'rh_max': round(max(d['rhs'])),
                    'rh_avg': round(avg_rh),
                    'h_min': round(min(h_values), 1),
                    'h_max': round(max(h_values), 1),
                    'h_avg': round(h_avg, 1),
                    'wc': weather_codes.get(day)
                })
        
        # Build compact hourly array for day/week views
        hourly_arr = []
        for i in range(len(times)):
            if temps[i] is not None and rhs[i] is not None:
                t = temps[i]
                rh = rhs[i]
                psat = 0.6108 * math.exp(17.27 * t / (t + 237.3))
                pw = (rh / 100) * psat
                w = 0.621945 * pw / (101.325 - pw) if (101.325 - pw) > 0 else 0
                h = 1.006 * t + w * (2501 + 1.86 * t)
                hourly_arr.append({
                    'time': times[i],
                    'temp': round(t, 1),
                    'rh': round(rh),
                    'h': round(h, 1)
                })
        
        result = {
            'success': True,
            'source': 'open-meteo',
            'lat': float(lat_key),
            'lon': float(lon_key),
            'year': year,
            'timezone': data.get('timezone', ''),
            'daily': daily,
            'hourly': hourly_arr,
            'hourly_count': len(times),
            '_from_cache': False,
            '_elapsed_ms': int((_time.time() - _t0) * 1000)
        }
        print(f"[WX] {lat_key},{lon_key} yr={year} -> NET ({result['_elapsed_ms']}ms)")

        # Always cache. Past years are immutable; current-year cache is honored
        # for 24 h before being re-fetched (see freshness check above), so we
        # do not need a year filter here. fsync to flash so it survives a
        # controller power cycle.
        try:
            tmp = cache_file + '.tmp'
            payload = json.dumps(result)
            fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
            try:
                os.write(fd, payload.encode('utf-8'))
                try: os.fsync(fd)
                except OSError: pass
            finally:
                os.close(fd)
            os.replace(tmp, cache_file)
        except Exception:
            pass

        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# --- TOMORROW FORECAST (from past years same-day data) ---
import datetime
import threading

def _compute_enthalpy(t, rh):
    """Compute enthalpy from temp (C) and RH (%)."""
    psat = 0.6108 * math.exp(17.27 * t / (t + 237.3))
    pw = (rh / 100) * psat
    w = 0.621945 * pw / (101.325 - pw) if (101.325 - pw) > 0 else 0
    return round(1.006 * t + w * (2501 + 1.86 * t), 1)


def get_tomorrow_forecast(lat, lon):
    """Look up past year's weather data for tomorrow's date. Returns dict with min/max T/RH/H."""
    tomorrow = datetime.date.today() + datetime.timedelta(days=1)
    past_year = tomorrow.year - 1
    target_date = f'{past_year}-{tomorrow.month:02d}-{tomorrow.day:02d}'

    # Normalize to the same canonical lat/lon format used by /api/weather-history
    # so we share the same cache file (no duplicate writes, no extra net hits).
    try:
        lat_key = f"{round(float(lat), 2):.2f}"
        lon_key = f"{round(float(lon), 2):.2f}"
    except (TypeError, ValueError):
        return {'success': False, 'error': 'lat/lon must be numeric'}
    cache_file = os.path.join('/root/data', 'configs', f'weather_{lat_key}_{lon_key}_{past_year}.json')

    data = None
    if os.path.isfile(cache_file):
        try:
            with open(cache_file, 'r') as f:
                data = json.load(f)
        except Exception:
            pass

    if not data:
        # Fetch from Open-Meteo
        try:
            params = urllib.parse.urlencode({
                'latitude': lat_key, 'longitude': lon_key,
                'start_date': f'{past_year}-01-01', 'end_date': f'{past_year}-12-31',
                'hourly': 'temperature_2m,relative_humidity_2m',
                'daily': 'weather_code',
                'timezone': 'auto'
            })
            url = f'https://archive-api.open-meteo.com/v1/archive?{params}'
            req = urllib.request.Request(url, headers={'User-Agent': 'RED5-Controller/1.2'})
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = json.loads(resp.read().decode())

            times = raw.get('hourly', {}).get('time', [])
            temps = raw.get('hourly', {}).get('temperature_2m', [])
            rhs = raw.get('hourly', {}).get('relative_humidity_2m', [])

            day_data = {}
            for i in range(len(times)):
                day = times[i][:10]
                if day not in day_data:
                    day_data[day] = {'temps': [], 'rhs': []}
                if temps[i] is not None:
                    day_data[day]['temps'].append(temps[i])
                if rhs[i] is not None:
                    day_data[day]['rhs'].append(rhs[i])

            daily = []
            for day in sorted(day_data.keys()):
                d = day_data[day]
                if d['temps'] and d['rhs']:
                    h_values = []
                    for ti, ri in zip(d['temps'], d['rhs']):
                        h_values.append(_compute_enthalpy(ti, ri))
                    daily.append({
                        'date': day,
                        'temp_min': round(min(d['temps']), 1),
                        'temp_max': round(max(d['temps']), 1),
                        'rh_min': round(min(d['rhs'])),
                        'rh_max': round(max(d['rhs'])),
                        'h_min': round(min(h_values), 1),
                        'h_max': round(max(h_values), 1),
                    })
            data = {'daily': daily}

            # Only write a separate cache here if the weather-history endpoint
            # has not already populated a *complete* canonical cache. Writing a
            # daily-only payload over the top of the rich daily+hourly payload
            # would silently corrupt it, and the orphan sweep would later
            # delete this incomplete file.
            try:
                if not os.path.isfile(cache_file):
                    tmp = cache_file + '.tmp'
                    payload = json.dumps(data)
                    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
                    try:
                        os.write(fd, payload.encode('utf-8'))
                        try: os.fsync(fd)
                        except OSError: pass
                    finally:
                        os.close(fd)
                    os.replace(tmp, cache_file)
            except Exception:
                pass
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # Find the target date
    if data and 'daily' in data:
        for d in data['daily']:
            if d['date'] == target_date:
                return {
                    'success': True,
                    'forecast_date': f'{tomorrow.isoformat()}',
                    'source_date': target_date,
                    'source_year': past_year,
                    't_min': d['temp_min'], 't_max': d['temp_max'],
                    'rh_min': d['rh_min'], 'rh_max': d['rh_max'],
                    'h_min': d.get('h_min', _compute_enthalpy(d['temp_min'], d['rh_min'])),
                    'h_max': d.get('h_max', _compute_enthalpy(d['temp_max'], d['rh_max'])),
                }

    return {'success': False, 'error': f'No data found for {target_date}'}


def write_forecast_to_bacnet(forecast, csv_id='CSV1'):
    """
    Write tomorrow's forecast to a BACnet CSV object on the controller.
    CSV value format: "t_min,t_max,rh_min,rh_max,h_min,h_max"

    PLACEHOLDER: Replace dibt.Write() with actual BACnet call.
    csv_id will be provided (e.g., 'CSV1' or 'CSV[N]' where N = id).
    """
    if not forecast or not forecast.get('success'):
        return False

    csv_value = f"{forecast['t_min']},{forecast['t_max']},{forecast['rh_min']},{forecast['rh_max']},{forecast['h_min']},{forecast['h_max']}"

    # --- PLACEHOLDER: BACnet write ---
    # from dibt import Write
    # Write(csv_id, Present_Value, csv_value)
    print(f'[FORECAST] Would write to {csv_id}: {csv_value}')
    print(f'[FORECAST] For date: {forecast["forecast_date"]} (source: {forecast["source_date"]})')

    # Log to file for verification
    try:
        log_path = os.path.join('/root/data', 'configs', 'forecast_log.json')
        log_entry = {
            'written_at': datetime.datetime.now().isoformat(),
            'csv_id': csv_id,
            'csv_value': csv_value,
            **forecast
        }
        logs = []
        if os.path.isfile(log_path):
            with open(log_path, 'r') as f:
                logs = json.load(f)
        logs.append(log_entry)
        # Keep last 30 entries
        logs = logs[-30:]
        with open(log_path, 'w') as f:
            json.dump(logs, f, indent=2)
    except:
        pass

    return True


# Forecast config stored in /root/data/configs/forecast_config.json
FORECAST_CONFIG_PATH = os.path.join('/root/data', 'configs', 'forecast_config.json')

def _load_forecast_config():
    try:
        if os.path.isfile(FORECAST_CONFIG_PATH):
            with open(FORECAST_CONFIG_PATH, 'r') as f:
                return json.load(f)
    except:
        pass
    return {}


def _daily_forecast_job():
    """Background job: compute tomorrow's forecast and write to BACnet. Runs daily at 23:00."""
    while True:
        try:
            now = datetime.datetime.now()
            # Schedule for 23:00 today, or tomorrow if already past 23:00
            target = now.replace(hour=23, minute=0, second=0, microsecond=0)
            if now >= target:
                target += datetime.timedelta(days=1)
            wait_secs = (target - now).total_seconds()
            print(f'[FORECAST] Next run at {target.isoformat()}, waiting {wait_secs:.0f}s')
            threading.Event().wait(wait_secs)

            config = _load_forecast_config()
            lat = config.get('lat')
            lon = config.get('lon')
            csv_id = config.get('csv_id', 'CSV1')

            if lat and lon:
                forecast = get_tomorrow_forecast(lat, lon)
                if forecast.get('success'):
                    write_forecast_to_bacnet(forecast, csv_id)
                    print(f'[FORECAST] Written: {forecast["forecast_date"]}')
                else:
                    print(f'[FORECAST] Failed: {forecast.get("error")}')
            else:
                print('[FORECAST] No lat/lon configured. Set via /api/forecast-config.')
        except Exception as e:
            print(f'[FORECAST] Error: {e}')
            threading.Event().wait(60)

# (Background forecast thread is started inside register(), not at
# module-import time, so the thread does not run before app.py is ready.)


def tomorrow_forecast():
    """Get tomorrow's forecast based on past year's same-day data."""
    config = _load_forecast_config()
    lat = request.args.get('lat') or config.get('lat')
    lon = request.args.get('lon') or config.get('lon')
    if not lat or not lon:
        return jsonify({'success': False, 'error': 'lat/lon required. Set via /api/forecast-config or pass as query params.'}), 400
    result = get_tomorrow_forecast(lat, lon)
    return jsonify(result)


def forecast_config():
    """Get or set forecast configuration (lat, lon, csv_id)."""
    if request.method == 'POST':
        data = request.json or {}
        config = _load_forecast_config()
        if 'lat' in data: config['lat'] = data['lat']
        if 'lon' in data: config['lon'] = data['lon']
        if 'csv_id' in data: config['csv_id'] = data['csv_id']
        try:
            os.makedirs(os.path.dirname(FORECAST_CONFIG_PATH), exist_ok=True)
            with open(FORECAST_CONFIG_PATH, 'w') as f:
                json.dump(config, f, indent=2)
            return jsonify({'success': True, 'config': config})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    else:
        return jsonify({'success': True, 'config': _load_forecast_config()})


def forecast_write_now():
    """Manually trigger forecast computation and BACnet write."""
    config = _load_forecast_config()
    lat = config.get('lat')
    lon = config.get('lon')
    csv_id = config.get('csv_id', 'CSV1')
    if not lat or not lon:
        return jsonify({'success': False, 'error': 'lat/lon not configured.'}), 400
    forecast = get_tomorrow_forecast(lat, lon)
    if not forecast.get('success'):
        return jsonify(forecast), 400
    written = write_forecast_to_bacnet(forecast, csv_id)
    return jsonify({**forecast, 'written': written, 'csv_id': csv_id,
                    'csv_value': f"{forecast['t_min']},{forecast['t_max']},{forecast['rh_min']},{forecast['rh_max']},{forecast['h_min']},{forecast['h_max']}"})


def register(app, ctx):
    """Attach weather routes to ``app`` and stash shared paths.

    ``ctx`` keys:
        DATA_ROOT (required)

    Optional flags:
        start_forecast_thread (default True) — set False to skip the
            background daily-forecast thread, useful for unit tests.
    """
    global DATA_ROOT, WEATHER_LOC_PATH, FORECAST_CONFIG_PATH
    DATA_ROOT = ctx['DATA_ROOT']
    WEATHER_LOC_PATH     = os.path.join(DATA_ROOT, 'configs', 'weather_location.json')
    FORECAST_CONFIG_PATH = os.path.join(DATA_ROOT, 'configs', 'forecast_config.json')

    app.add_url_rule('/api/weather-location',  'get_weather_location',
                     get_weather_location, methods=['GET'])
    app.add_url_rule('/api/weather-location',  'set_weather_location',
                     set_weather_location, methods=['POST'])
    app.add_url_rule('/api/weather-history',   'weather_history',
                     weather_history, methods=['GET'])
    app.add_url_rule('/api/tomorrow-forecast', 'tomorrow_forecast',
                     tomorrow_forecast, methods=['GET'])
    app.add_url_rule('/api/forecast-config',   'forecast_config',
                     forecast_config, methods=['GET', 'POST'])
    app.add_url_rule('/api/forecast-write-now','forecast_write_now',
                     forecast_write_now, methods=['POST'])

    if ctx.get('start_forecast_thread', True):
        t = threading.Thread(target=_daily_forecast_job, daemon=True,
                             name='weather-forecast-daily')
        t.start()

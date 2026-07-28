// Red5-Studio V1.2 — Schema Configuration
// ALIGNER_TYPES registry, ID_TO_TYPE map, sanitizeSchema, fallback schema

const ALIGNER_TYPES = [
    'centrifugal_fan', 'rectangular_fan', 'rectangular_fan_aligner', 'hydration_valve', 'hydration_valve_aligner', 'damper', 'circular_damper',
    'neon_pipe_coil', 'diff_pressure_switch', 'differential_pressure_switch_aligner', 'air_flow_path', 'air_flow_aligner',
    'vfd_aligner', 'antifreeze_coil_valve', 'antifreeze_coil',
    'dp_sensor_aligner', 'dp_display_aligner'
];

const ID_TO_TYPE = {
    'supply_fan_rotor': 'centrifugal_fan', 'exhaust_fan_rotor': 'centrifugal_fan',
    'supply_fan_rotor_1': 'centrifugal_fan', 'supply_fan_rotor_2': 'centrifugal_fan',
    'airflow_station': 'rectangular_fan', 'fan_rotor': 'rectangular_fan',
    'airflow_station_1': 'rectangular_fan', 'airflow_station_2': 'rectangular_fan',
    'antiFreeze_coil': 'antifreeze_coil_valve',
    'freeze_stat': 'antifreeze_coil_valve',
    'cooling_coil_valve': 'neon_pipe_coil', 'heating_coil_valve': 'neon_pipe_coil',
    'cooling_coil_valve_1': 'neon_pipe_coil', 'cooling_coil_valve_2': 'neon_pipe_coil',
    'heating_coil_valve_1': 'neon_pipe_coil', 'heating_coil_valve_2': 'neon_pipe_coil',
    'heating_coil': 'neon_pipe_coil', 'cooling_coil': 'neon_pipe_coil',
    'filter_switch': 'diff_pressure_switch', 'filter_switch_1': 'diff_pressure_switch', 'filter_switch_2': 'diff_pressure_switch',
    'oa_damper': 'damper', 'sa_damper': 'damper', 'exhaust_damper': 'damper', 'damper_blade': 'damper',
    'oa_damper_1': 'damper', 'sa_damper_1': 'damper', 'oa_damper_2': 'damper', 'sa_damper_2': 'damper',
    'main_air_flow_status': 'air_flow_path', 'air_flow_indicator_1': 'air_flow_path', 'air_flow_indicator_2': 'air_flow_path',
    'vav_air_flow': 'air_flow_path', 'lab_air_flow': 'air_flow_path',
    'vfd_screen': 'vfd_aligner', 'vfd_pill': 'vfd_aligner', 'vfd_set': 'vfd_aligner',
    'hydration_valve': 'hydration_valve'
};

const DEFAULT_FAN_PATH = "M 10 60 L 10 10 L 60 10 A 50 50 0 1 1 10 60 Z";
const DEFAULT_WAVY_PATH = "M 10 50 C 30 20, 70 80, 90 50"; 

const rawFallback = {
  "ahu_types": {
    // Zero-padded 2-digit naming convention (operator standard, 2026-06-15):
    //   Type 1  -> AHU_TYPE_01.jpg
    //   Type 9  -> AHU_TYPE_09.jpg
    //   Type 10 -> AHU_TYPE_10.jpg
    // Picker derives filename from `base_graphic` here, so this template
    // controls the default lookup name when no custom config overrides.
    "1": { "name": "AHU_TYPE_01", "visual_assets": { "base_graphic": "AHU_TYPE_01.jpg", "animations": [] }, "points": [] },
    "2": { "name": "AHU_TYPE_02", "visual_assets": { "base_graphic": "AHU_TYPE_02.svg", "animations": [] }, "points": [] }
  },
  "vav_types": {
    "1": { "name": "Standard VAV", "points": [] }
  }
};

// =====================================================================
// Auto-group migration (Concept B — single source of truth)
// =====================================================================
// Earlier versions of equipment_mapper.html derived sensor groups from
// a hard-coded label-match list inside the React component, while the
// drag-and-drop UI (added later) operated on a parallel `sensor_groups[]`
// array + `group_id` field on each point.  This split caused operators
// to see "Ungrouped Sensors" in the Schema view even when the canvas
// rendered a "SAF" (SA) pill from the auto-match.
//
// Migration rule (idempotent):
//   For every point whose `label` matches one of the SEED_GROUPS rules
//   AND whose `group_id` is not already set, we
//     1. Ensure a sensor_groups[] entry with `id = seed.id` exists
//        (creating it with `name = seed.defaultName` if not).
//     2. Set the point's `group_id` to that id.
//   Subsequent loads are no-ops because group_id is now sticky on disk.
//
// Operators can then add / remove members through the standard
// drag-and-drop UI; the seed list never runs against them again.
// =====================================================================
const SEED_GROUPS = [
    { id: 'OA',              defaultName: 'OA',              match: ['OAT', 'OAH', 'OAD'] },
    { id: 'SA',              defaultName: 'SA',              match: ['SAT', 'SAH', 'SAF', 'SAD', 'SAFM', 'SAPT', 'SATSP'], matchRegex: /^INV\d+_F$/ },
    { id: 'Hydration',       defaultName: 'Hydration',       match: ['HM', 'HV', 'HSP'] },
    { id: 'AHU',             defaultName: 'AHU',             match: ['AHUSS', 'AHUM', 'HCM'] },
    { id: 'Static_Pressure', defaultName: 'Static Pressure', match: ['SPR', 'SPRSP'] },
];

function migrateAutoGroups(entry) {
    if (!entry || !Array.isArray(entry.points)) return;
    if (!Array.isArray(entry.sensor_groups)) entry.sensor_groups = [];
    const existingIds = new Set(entry.sensor_groups.map(g => g.id));

    SEED_GROUPS.forEach(seed => {
        const matchedIndices = [];
        entry.points.forEach((p, i) => {
            if (p.group_id) return; // already user-grouped — leave alone
            if (seed.match.includes(p.label) || (seed.matchRegex && seed.matchRegex.test(p.label))) {
                matchedIndices.push(i);
            }
        });
        if (matchedIndices.length === 0) return;
        if (!existingIds.has(seed.id)) {
            entry.sensor_groups.push({ id: seed.id, name: seed.defaultName, collapsed: false });
            existingIds.add(seed.id);
        }
        matchedIndices.forEach(i => { entry.points[i].group_id = seed.id; });
    });
}

const sanitizeSchema = (data) => {
    const sanitized = JSON.parse(JSON.stringify(data));
    ['ahu_types', 'vav_types'].forEach(cat => {
        if(sanitized[cat]) {
            Object.keys(sanitized[cat]).forEach(id => {
                const entry = sanitized[cat][id];
                const anims = (entry && entry.visual_assets && entry.visual_assets.animations) || [];
                anims.forEach(a => { 
                    // Legacy element_id-based inference runs ONLY when animation_type is absent.
                    // If the saved JSON already has animation_type (e.g. 'circular_damper'), respect it.
                    if (!a.animation_type) {
                        if (a.element_id && a.element_id.toLowerCase().includes('fan')) {
                            a.animation_type = 'centrifugal_fan';
                        } else if (a.element_id && ID_TO_TYPE[a.element_id]) {
                            a.animation_type = ID_TO_TYPE[a.element_id];
                        }
                    }
                    
                    if(a.x === undefined) a.x = 50; 
                    if(a.y === undefined) a.y = 50; 
                    if(a.scale === undefined) a.scale = 1.0; 
                    if(a.stretchX === undefined) a.stretchX = 1.0; 
                    if(a.stretchY === undefined) a.stretchY = 1.0; 
                    if(a.skewX === undefined) a.skewX = 0.0; 
                    if(a.skewY === undefined) a.skewY = 0.0; 
                    if(a.rotX === undefined) a.rotX = 0.0; 
                    if(a.rotY === undefined) a.rotY = 0.0; 
                    if(a.rotZ === undefined) a.rotZ = 0.0; 
                    
                    if(a.base_w === undefined) a.base_w = 150;
                    if(a.base_h === undefined) a.base_h = 150;

                    if(a.pipeLength === undefined) a.pipeLength = 150;
                    if(a.pipeThickness === undefined) a.pipeThickness = 16;
                    if(a.separation === undefined) a.separation = 30;

                    if(a.sensor_x === undefined) a.sensor_x = a.x !== null ? a.x + 10 : 50;
                    if(a.sensor_y === undefined) a.sensor_y = a.y !== null ? a.y - 20 : 50;
                    if(a.sensor_scale === undefined) a.sensor_scale = 0.8;
                    if(a.sensor_stretchX === undefined) a.sensor_stretchX = 1.0; 
                    if(a.sensor_stretchY === undefined) a.sensor_stretchY = 1.0; 
                    if(a.sensor_skewX === undefined) a.sensor_skewX = 0.0; 
                    if(a.sensor_skewY === undefined) a.sensor_skewY = 0.0; 
                    if(a.sensor_rotX === undefined) a.sensor_rotX = 0.0; 
                    if(a.sensor_rotY === undefined) a.sensor_rotY = 0.0; 
                    if(a.sensor_rotZ === undefined) a.sensor_rotZ = 0.0; 
                    
                    if(a.pill_x === undefined) a.pill_x = a.x;
                    if(a.pill_y === undefined) a.pill_y = a.y !== null ? a.y + 10 : null;
                    if(a.pill_scale === undefined) a.pill_scale = 1.0;

                    if (a.animation_type === 'air_flow_path' || a.animation_type === 'air_flow_aligner') {
                        if (!a.segments || a.segments.length === 0) {
                            a.segments = [{
                                id: Date.now(), type: "SA",
                                offsetX: 0, offsetY: 0, 
                                scale: 1.0, stretchX: 1.0, stretchY: 1.0, rotX: 0, rotY: 0, rotZ: 0, skewX: 0, skewY: 0,
                                path: DEFAULT_WAVY_PATH, start_sensor: "", end_sensor: ""
                            }];
                        } else {
                            // Ensure each segment has all required properties
                            a.segments.forEach(seg => {
                                if (seg.offsetX === undefined) seg.offsetX = 0;
                                if (seg.offsetY === undefined) seg.offsetY = 0;
                                if (seg.scale === undefined) seg.scale = 1.0;
                                if (seg.stretchX === undefined) seg.stretchX = 1.0;
                                if (seg.stretchY === undefined) seg.stretchY = 1.0;
                                if (seg.rotX === undefined) seg.rotX = 0;
                                if (seg.rotY === undefined) seg.rotY = 0;
                                if (seg.rotZ === undefined) seg.rotZ = 0;
                                if (seg.skewX === undefined) seg.skewX = 0;
                                if (seg.skewY === undefined) seg.skewY = 0;
                                if (!seg.path) seg.path = DEFAULT_WAVY_PATH;
                                if (!seg.type) seg.type = "SA";
                                if (!seg.id) seg.id = Date.now() + Math.random();
                            });
                        }
                    }
                    
                    if(a.animation_type === 'centrifugal_fan' && (!a.outline_path || a.outline_path.includes("M 10 50"))) {
                        a.outline_path = DEFAULT_FAN_PATH;
                    }
                });
                const entry2 = sanitized[cat][id];
                const pts = (entry2 && entry2.points) || [];
                pts.forEach(p => { 
                    if(p.x === undefined) p.x = null; 
                    if(p.y === undefined) p.y = null; 
                    if(p.scale === undefined) p.scale = 1.0; 
                    if(p.label === undefined) p.label = 'UNNAMED';
                    if(p.name === undefined) p.name = p.label; 
                    if(p.unit === undefined) p.unit = '';
                    // Default group_id to null so migrateAutoGroups can
                    // detect "not yet grouped" and assign the seed bucket.
                    if(p.group_id === undefined) p.group_id = null;
                });
                // One-shot auto-group migration (idempotent — leaves
                // points whose group_id is already set untouched).
                migrateAutoGroups(entry2);
            });
        }
    });
    return sanitized;
};

const FALLBACK_SCHEMA = sanitizeSchema(rawFallback);

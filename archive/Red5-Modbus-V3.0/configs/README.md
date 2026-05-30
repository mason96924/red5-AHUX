# configs/

JSON configuration files. Schema-driven, no hardcoded values in code.

## Layout

```
configs/
├── system.json            # Controller-level settings (enabled drivers, log level, etc.)
└── drivers/
    └── scu_<name>.json    # Per-SCU instance config
```

## Deployment

Configs are deployed via bundle upload to `/root/data/configs/` on the controller.

`app.py` exposes endpoints to read/write these (gated by master key).

## Example: `system.json`

```json
{
  "drivers_enabled": ["scu_lighting_01"],
  "log_level": "INFO",
  "cache_snapshot_interval_s": 5,
  "watchdog_check_interval_s": 5
}
```

## Example: `drivers/scu_lighting_01.json` (planned, subject to spec)

```json
{
  "driver_type": "scu_modbus",
  "name": "scu_lighting_01",
  "host": "10.0.1.50",
  "port": 502,
  "server_id": 1,
  "device_population": {
    "4srm":  { "device_indices": [] },
    "6srm":  { "device_indices": [0, 1, 2, ...] },
    "4erm":  { "device_indices": [] },
    "6erm":  { "device_indices": [] },
    "48srm": { "device_indices": [] }
  },
  "polling": {
    "fast_tier_interval_ms": 1000,
    "slow_tier_interval_ms": 30000,
    "request_timeout_ms": 2000,
    "write_timeout_ms": 5000
  },
  "reliability": {
    "reconnect_backoff_start_ms": 500,
    "reconnect_backoff_cap_ms": 30000,
    "busy_retry_max": 3
  }
}
```

(Schema may evolve during Phase 0 reconnaissance.)

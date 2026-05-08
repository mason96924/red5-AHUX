# Controller Environment Setup Guide

## Changes for Embedded Controller

The `api_server.py` has been modified to work in your embedded controller environment:

### ❌ Removed (Not Supported in Controllers)
- `__file__` variable
- `if __name__ == "__main__"` block
- Command-line arguments (`argparse`)

### ✅ Added (Controller-Friendly)
- Direct execution (no `if __name__` check)
- Environment variable configuration
- Hardcoded path option
- Auto-detection fallback

---

## Configuration Options

### Option 1: Environment Variable (Recommended)

Set `ABC_BASE_DIR` environment variable before starting:

```bash
export ABC_BASE_DIR=/path/to/your/ABC
python3 api_server.py
```

Or in supervisor config:
```ini
[program:red5_api]
command=python3 /path/to/ABC/scripts/api_server.py
environment=ABC_BASE_DIR="/path/to/ABC",PORT="8000"
```

### Option 2: Edit api_server.py (Hardcode Path)

Edit line 23-26 in `api_server.py`:

```python
# Comment out Option 1
# BASE_DIR = Path(os.environ.get('ABC_BASE_DIR', '/app'))

# Uncomment and edit Option 2
BASE_DIR = Path('/your/actual/path/to/ABC')
```

### Option 3: Auto-Detect (Run from [ABC]/scripts/)

Edit line 23-29 in `api_server.py`:

```python
# Comment out Option 1
# BASE_DIR = Path(os.environ.get('ABC_BASE_DIR', '/app'))

# Uncomment Option 3
BASE_DIR = Path(os.getcwd()).parent  # Assumes script runs from [ABC]/scripts/
```

---

## Environment Variables

### Supported Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ABC_BASE_DIR` | `/app` | Base directory containing data/ and scripts/ |
| `PORT` | `8000` | Server port |
| `HOST` | `0.0.0.0` | Bind address (use 0.0.0.0 for network access) |

### Setting in Controller

**Method 1: System environment**
```bash
export ABC_BASE_DIR=/your/path
export PORT=8000
```

**Method 2: In supervisor/systemd config**
```ini
environment=ABC_BASE_DIR="/your/path",PORT="8000",HOST="0.0.0.0"
```

**Method 3: In Python script wrapper**
```python
import os
os.environ['ABC_BASE_DIR'] = '/your/path'
exec(open('api_server.py').read())
```

---

## Testing the Fix

### 1. Test Path Detection

Create a test file: `[ABC]/scripts/test_path.py`

```python
from pathlib import Path
import os

# Test each option
print("Testing path detection:")

# Option 1: Environment variable
BASE_DIR = Path(os.environ.get('ABC_BASE_DIR', '/app'))
print(f"Option 1 (env var): {BASE_DIR}")

# Option 2: Hardcoded
BASE_DIR = Path('/your/path/to/ABC')
print(f"Option 2 (hardcode): {BASE_DIR}")

# Option 3: Auto-detect
BASE_DIR = Path(os.getcwd()).parent
print(f"Option 3 (auto): {BASE_DIR}")

# Verify paths exist
DATA_DIR = BASE_DIR / "data"
print(f"\nData dir exists: {DATA_DIR.exists()}")
print(f"Data dir path: {DATA_DIR}")
```

Run:
```bash
cd [ABC]/scripts/
python3 test_path.py
```

### 2. Test Server Startup

```bash
# Set environment variable
export ABC_BASE_DIR=/your/path/to/ABC

# Start server
cd [ABC]/scripts/
python3 api_server.py
```

Expected output:
```
======================================================================
🚀 Red5 Platform Studio API Server - CONTROLLER MODE
======================================================================
📁 Base Directory:   /your/path/to/ABC
📁 Data Directory:   /your/path/to/ABC/data
...
```

### 3. Test Health Check

```bash
curl http://localhost:8000/health
```

Expected:
```json
{
  "status": "healthy",
  "base_dir": "/your/path/to/ABC",
  "data_dir": "/your/path/to/ABC/data"
}
```

---

## Supervisor Configuration Example

Create `/etc/supervisor/conf.d/red5_api.conf`:

```ini
[program:red5_api]
command=/usr/bin/python3 /path/to/ABC/scripts/api_server.py
directory=/path/to/ABC/scripts
environment=ABC_BASE_DIR="/path/to/ABC",PORT="8000",HOST="0.0.0.0"
user=your-user
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/red5_api.log
```

Reload supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start red5_api
```

---

## Troubleshooting

### Error: "NameError: name '__file__' is not defined"

✅ **Fixed** - Updated `api_server.py` no longer uses `__file__`

### Error: Wrong base directory detected

**Solution 1:** Set environment variable
```bash
export ABC_BASE_DIR=/correct/path
```

**Solution 2:** Edit `api_server.py` line 23
```python
BASE_DIR = Path('/correct/path/to/ABC')
```

### Error: "No such file or directory: '/app/data'"

The default path `/app` is being used. Fix:

1. Set `ABC_BASE_DIR` environment variable, or
2. Edit `api_server.py` to hardcode your path

### Server starts but Config Tool not found

Check:
```bash
ls [ABC]/data/Equipment_Schema_Mapper_v12_10.html
```

If missing, copy:
```bash
cp /app/frontend/public/Equipment_Schema_Mapper_v12_10.html [ABC]/data/
```

---

## Quick Setup for Controller

**1. Set your base path (choose one):**

```bash
# Option A: Environment variable
export ABC_BASE_DIR=/your/actual/path

# Option B: Edit api_server.py line 23
# BASE_DIR = Path('/your/actual/path')
```

**2. Run server:**

```bash
cd [ABC]/scripts/
python3 api_server.py
```

**3. Verify:**

```bash
curl http://localhost:8000/health
```

Should return your actual paths:
```json
{
  "status": "healthy",
  "base_dir": "/your/actual/path",
  "data_dir": "/your/actual/path/data"
}
```

---

## Summary

✅ **No `__file__` dependency** - Uses env vars or hardcoded paths  
✅ **No `if __name__ == "__main__"`** - Direct execution  
✅ **Controller-friendly** - Works in embedded Python environments  
✅ **Flexible configuration** - 3 options to set base path  
✅ **Network access** - Still detects and shows network IP  

**Your controller environment is now supported!** 🎮

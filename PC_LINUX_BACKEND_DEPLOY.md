# Host the FastAPI + MongoDB Backend on Your Linux PC

Continuation of `/app/PC_LINUX_DEPLOY.md` (front-end). Adding the
backend unlocks: live telemetry on `/dashboard.html`, weather fetch on
`/psy_3d.html`, password login at `/admin-login`, and tenant
configuration persistence.

## Architecture

```
┌─────────────────────┐    HTTP    ┌─────────────────────┐    Mongo wire
│  Static front-end   │ ─────────► │   FastAPI backend   │ ─────────────► MongoDB
│ Caddy / nginx :80   │            │   uvicorn   :8001   │                  :27017
│ (PC_LINUX_DEPLOY)   │            │  (this doc)         │                (this doc)
└─────────────────────┘            └─────────────────────┘
```

Same machine or separate machines — both work. This guide assumes
**same machine** for simplicity.

---

## Part 1 — Prerequisites

```bash
# Python 3.11+ (project uses 3.11 features)
python3 --version    # should be 3.11 or newer

# If older:
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev

# MongoDB Community Edition 6.x or 7.x
# Ubuntu 22.04 / 24.04:
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg --dearmor -o /usr/share/keyrings/mongo-server-7.0.gpg
echo "deb [signed-by=/usr/share/keyrings/mongo-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

sudo systemctl enable --now mongod
sudo systemctl status mongod    # active (running) expected
```

Fedora / Arch users: see https://www.mongodb.com/docs/manual/installation/

---

## Part 2 — Get the backend code

If you followed `PC_LINUX_DEPLOY.md`, you already have the repo cloned.
The backend lives at `red5-studio/backend/`.

```bash
cd ~/red5-studio/backend
ls
# auth.py  allowlist.py  password_auth.py  routes/  server.py
# services/  tenants.py  tests/  demo_data/  .env (you create this)
```

---

## Part 3 — Python virtual environment + dependencies

```bash
cd ~/red5-studio/backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# Install the exact stack the project uses
pip install \
    "fastapi==0.104.1" \
    "uvicorn[standard]>=0.27" \
    "motor==3.3.1" \
    "pydantic[email]==2.12.5" \
    "python-dotenv>=1.0" \
    "bcrypt==4.1.3" \
    "httpx==0.28.1" \
    "python-multipart>=0.0.6"
```

If the project includes a `requirements.txt` in the future:
```bash
pip install -r requirements.txt
```

---

## Part 4 — Create the `.env` file

```bash
cd ~/red5-studio/backend
```

Create `.env` (replace UPPERCASE placeholders):

```bash
# Local MongoDB (no auth, default port)
MONGO_URL=mongodb://localhost:27017
DB_NAME=red5_local

# Frontend origin — must exactly match the URL you serve the front-end on
# (used for CORS allow-list).  Multiple origins comma-separated.
FRONTEND_ORIGIN=http://localhost:8080,http://localhost,http://127.0.0.1:8080

# Admin allow-list (comma-separated emails who can sign in)
ADMIN_EMAILS=you@example.com

# Optional: password-fallback login (bypasses Google OAuth).
# Used at the /admin-login page.  Leave both blank to disable.
ADMIN_PASSWORD_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=
```

### Generate the bcrypt hash for the password

In the activated venv:

```bash
python3 -c "import bcrypt; print(bcrypt.hashpw(b'YOUR_NEW_PASSWORD', bcrypt.gensalt(rounds=12)).decode())"
```

The output starts with `$2b$12$...` — paste that string as the value of
`ADMIN_PASSWORD_HASH=` in `.env`.

> ⚠️ Quote-escape the `$` signs if your shell/process manager
> interpolates them. Best practice: keep the hash on a single line and
> avoid `bash` heredocs.

---

## Part 5 — First-run test

```bash
cd ~/red5-studio/backend
source .venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

In another terminal, verify it answers:
```bash
curl -s http://localhost:8001/api/version
# → {"version":"v2.0...", ...}

curl -s http://localhost:8001/api/auth/me
# → 401 (no cookie yet — expected)
```

Press `Ctrl+C` to stop uvicorn.

---

## Part 6 — Point the front-end at this backend

Back in the front-end folder (from `PC_LINUX_DEPLOY.md`):

```bash
cd ~/red5-studio/frontend

# Point the React shell at your local backend
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Rebuild
yarn build
```

Restart whatever you're using to serve `build/` (Python http.server,
Caddy, nginx — none need a "restart" if you only changed file
contents; just re-load the page).

---

## Part 7 — Test the full stack

1. Front-end: http://localhost:8080
2. Click **Sign in (admin)** → `/admin-login`
3. Enter `ADMIN_PASSWORD_EMAIL` + the raw password (not the hash!) from
   Part 4
4. You should be redirected to `/dashboard.html` with the auth pill
   in the top-right showing your email
5. Open `/psy_3d.html` → weather data fetches, 3D chart populates

If step 3 fails with **"invalid credentials"**:
```bash
# Confirm the hash you wrote into .env actually matches the password
cd ~/red5-studio/backend
source .venv/bin/activate
python3 -c "
import bcrypt, os
from dotenv import load_dotenv; load_dotenv()
h = os.environ['ADMIN_PASSWORD_HASH']
ok = bcrypt.checkpw(b'YOUR_NEW_PASSWORD', h.encode())
print('Password matches hash:', ok)
"
```

---

## Part 8 — Run uvicorn as a background service (systemd)

```bash
sudo tee /etc/systemd/system/red5-ahu.service > /dev/null << EOF
[Unit]
Description=Red5 Studio FastAPI Backend
After=network.target mongod.service
Requires=mongod.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/red5-studio/backend
Environment=PATH=$HOME/red5-studio/backend/.venv/bin:/usr/bin:/bin
EnvironmentFile=$HOME/red5-studio/backend/.env
ExecStart=$HOME/red5-studio/backend/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now red5-ahu
sudo systemctl status red5-ahu
sudo journalctl -u red5-ahu -f       # live logs (Ctrl+C to exit)
```

It now auto-starts on every boot, **after** MongoDB is ready.

---

## Part 9 — Production reverse proxy (optional but recommended)

If you used Caddy from `PC_LINUX_DEPLOY.md`, extend the Caddyfile so
`/api/*` routes go to FastAPI while everything else serves static
files:

```
:80 {
    # Static front-end (default)
    root * /home/YOU/red5-studio/frontend/build
    encode gzip

    # Anything starting with /api/ → uvicorn on :8001
    @api path /api/*
    handle @api {
        reverse_proxy localhost:8001
    }

    # SPA fallback for everything else
    handle {
        try_files {path} /index.html
        file_server
    }
}
```

```bash
sudo systemctl restart caddy
```

Now you can set `REACT_APP_BACKEND_URL=` (empty) in
`frontend/.env` and rebuild — the front-end uses same-origin requests.

Equivalent nginx snippet:

```nginx
server {
    listen 80;
    root /home/YOU/red5-studio/frontend/build;
    index index.html;

    location /api/ {
        proxy_pass         http://localhost:8001;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Part 10 — Seed demo data (optional)

The repo ships seed scripts for a sample tenant + asset:

```bash
cd ~/red5-studio/backend
source .venv/bin/activate
ls demo_data/        # csv / json bundles ready to import

# Example: seed allow-list from an env var
python3 -c "
import asyncio, os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv; load_dotenv()
async def go():
    c = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = c[os.environ['DB_NAME']]
    email = os.environ['ADMIN_EMAILS'].split(',')[0].strip().lower()
    await db.allowlist.update_one({'email': email}, {'\$set': {'email': email, 'role': 'admin'}}, upsert=True)
    print('Seeded allow-list:', email)
asyncio.run(go())
"
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `pymongo.errors.ServerSelectionTimeoutError` | `sudo systemctl status mongod` — ensure it's running. Also check `MONGO_URL` points to `localhost:27017` not the cloud Atlas URL. |
| `bcrypt.checkpw` returns False even with correct password | The `$` signs in the hash were shell-interpolated. Wrap the hash in **single quotes** when pasting into `.env` (no quotes at all is also fine since `.env` is literal). |
| CORS errors in browser console | Add the exact origin to `FRONTEND_ORIGIN` (e.g. `http://localhost:8080`, not `http://localhost`). Multiple comma-separated. |
| Login succeeds but `/api/auth/me` returns 401 next request | Cookie wasn't stored. Check that front-end and backend share the **same scheme** (both http or both https) and ideally the **same domain** (use the reverse-proxy setup in Part 9). |
| Telemetry doesn't update on `/dashboard.html` | The dashboard polls every 3s — wait at least 5s after sign-in. If still empty, `journalctl -u red5-ahu -n 50` to see backend errors. |
| Port 8001 already in use | `sudo lsof -i :8001` then `kill -9 <PID>`, or change the port in the systemd unit + the front-end `.env`. |
| MongoDB consumes too much RAM | Edit `/etc/mongod.conf` → `storage.wiredTiger.engineConfig.cacheSizeGB: 1` then `sudo systemctl restart mongod`. |

---

## Optional hardening for internet exposure

If you plan to expose this to the internet (not just localhost):

1. **HTTPS** via Caddy auto-cert: replace `:80` with `your-domain.com`.
   Caddy fetches a Let's Encrypt cert automatically (needs ports 80/443
   open in your router/firewall).
2. **Lock MongoDB to localhost only**:
   `/etc/mongod.conf` → `net.bindIp: 127.0.0.1` then restart `mongod`.
3. **Firewall**:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
4. **Strong admin password**: re-generate `ADMIN_PASSWORD_HASH` with a
   longer passphrase. The bcrypt cost factor of 12 means each attempt
   takes ~250 ms — adequate against online attacks.
5. **Update `FRONTEND_ORIGIN`** to your real domain only — drop the
   `localhost` entries when you go live.

---

## Quick sanity-check checklist

```bash
sudo systemctl status mongod         # ✓ active (running)
sudo systemctl status red5-ahu   # ✓ active (running)
sudo systemctl status caddy          # ✓ active (running) [if you use Caddy]
curl -s http://localhost:8001/api/version | head -c 200
curl -s http://localhost:8080/learn.html | head -c 200
```

All three green ⇒ you're done. Visit your URL in a browser and sign in.

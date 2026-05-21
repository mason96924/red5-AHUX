# Host Red5 Studio V2.0 on Your Linux PC (Static, No Backend)

Step-by-step guide to run the **3 educational pages + V2.0 React shell**
on a Linux PC as a pure static site. No FastAPI, no MongoDB, no Google
Auth required.

## What works without the backend

| Page | URL | Works? | Notes |
|---|---|---|---|
| Comfort Decoded chart | `/learn.html` | ✅ Fully | Zero-backend by design |
| Deep Dive matrix | `/deepdive.html` | ✅ Fully | Zero-backend by design |
| Building types index | `/buildings.html` | ✅ Fully | Zero-backend by design |
| V2.0 React landing | `/` | ⚠️ Renders | Login button will fail (no FastAPI) |
| Pro View dashboard | `/dashboard.html` | ⚠️ Renders shell | Telemetry charts empty (no live `/api/data`) |
| 3D Weather Strip | `/psy_3d.html` | ⚠️ Renders chart | Weather fetch fails — chart shows empty until backend exists |
| Admin login | `/admin-login` | ❌ Won't work | Needs `/api/auth/password-login` |

If you want fully-working dashboard + telemetry, host the FastAPI
backend + MongoDB too (separate guide).

---

## Part 1 — Prerequisites

On your Linux PC (Ubuntu / Debian / Fedora / Arch — any modern distro):

```bash
# Node 18 LTS or newer
sudo apt install -y nodejs npm                    # Debian / Ubuntu
# or:
sudo dnf install -y nodejs                        # Fedora
# or:
sudo pacman -S nodejs npm                         # Arch

# Yarn (the project uses yarn, not npm)
sudo npm install -g yarn

# Verify
node --version    # should print v18.x or newer
yarn --version    # should print 1.x
```

---

## Part 2 — Get the source

You have two options:

### Option A — From this Emergent project (recommended)

Use the **Save to GitHub** feature in the Emergent chat input to push
this codebase to your GitHub account, then on your PC:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git red5-studio
cd red5-studio/frontend
```

### Option B — Direct copy via scp / rsync

If you have shell access to the Emergent container (you usually don't),
or if your codebase is local:

```bash
rsync -avh frontend/ red5-studio/frontend/
cd red5-studio/frontend
```

---

## Part 3 — Build the static bundle

From inside the `frontend/` folder:

```bash
# Install dependencies (one-time, ~2-3 min)
yarn install

# Override the cloud backend URL — point to localhost so any leftover
# /api/* calls don't try to hit the production cluster.  These calls
# will fail (no backend), but they fail FAST and cleanly.
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env

# Build the production-optimized bundle
yarn build
```

Result: a folder called `build/` containing:
```
build/
├── index.html              ← V2.0 React shell (root)
├── learn.html              ← Comfort Decoded chart
├── deepdive.html           ← B1-B10 × building-type matrix
├── buildings.html          ← Building-type index
├── dashboard.html          ← Legacy V1.9 dashboard SPA
├── psy_3d.html             ← 3D weather strip
├── static/                 ← React bundles (hashed)
├── js/                     ← Vanilla JS for legacy pages
├── assets/                 ← Images, MD files
└── …
```

This `build/` folder is everything you need to host.

---

## Part 4 — Serve it

Pick whichever fits your comfort level.

### Option 1 — Python (zero install, instant)

```bash
cd build/
python3 -m http.server 8080 --bind 0.0.0.0
```

Open **http://127.0.0.1:8080** → V2.0 landing page.
Open **http://127.0.0.1:8080/learn.html** → educational chart.

Press `Ctrl+C` to stop.

> ⚠️ Use `127.0.0.1` not `localhost`. On many Linux distros `localhost`
> resolves to IPv6 `::1` first; if `http.server` binds IPv4 only,
> connections fail with "Connection refused". `--bind 0.0.0.0` + the
> explicit IPv4 address sidesteps the issue entirely.

> ⚠️ Python's `http.server` is single-threaded and not suitable for
> more than ~5 concurrent users. Fine for personal use; use Caddy or
> nginx for production.

### Option 2 — Caddy (production, auto-HTTPS)

```bash
sudo apt install -y caddy                          # Debian/Ubuntu
# or: sudo dnf install -y caddy                    # Fedora

sudo tee /etc/caddy/Caddyfile > /dev/null << 'EOF'
:80 {
    root * /home/YOU/red5-studio/frontend/build
    file_server
    # SPA fallback so React routes (/admin-login, etc.) don't 404
    try_files {path} /index.html
    encode gzip
}
EOF

sudo systemctl restart caddy
```

Open **http://localhost** → V2.0 landing.

For HTTPS + a public domain, replace `:80` with `your-domain.com` and
Caddy auto-issues a Let's Encrypt cert (port 80 + 443 must be reachable
from the internet).

### Option 3 — nginx (most popular)

```bash
sudo apt install -y nginx

sudo tee /etc/nginx/sites-available/red5 > /dev/null << 'EOF'
server {
    listen 80 default_server;
    root /home/YOU/red5-studio/frontend/build;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    gzip on;
    gzip_types text/css text/javascript application/javascript application/json image/svg+xml;
}
EOF

sudo ln -sf /etc/nginx/sites-available/red5 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### Option 4 — `serve` (Node, zero config, good for dev)

```bash
yarn global add serve
serve -s build -l 8080
```

`-s` flag enables SPA-style fallback to `index.html`.

---

## Part 5 — One-shot helper script

Save as `~/serve-red5.sh` and `chmod +x` it:

```bash
#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="${HOME}/red5-studio/frontend"
PORT="${PORT:-8080}"

cd "$PROJECT_DIR"
[ -d node_modules ] || yarn install --frozen-lockfile
[ -d build ]        || yarn build
cd build
echo "→ Red5 Studio static bundle live at http://localhost:$PORT"
exec python3 -m http.server "$PORT"
```

Then just run `./serve-red5.sh` whenever you want it up.

---

## Part 6 — Auto-start on boot (systemd)

For Caddy-based hosting, it auto-starts. For the Python option above:

```bash
sudo tee /etc/systemd/system/red5-static.service > /dev/null << 'EOF'
[Unit]
Description=Red5 Studio Static Bundle
After=network.target

[Service]
Type=simple
User=YOUR_LINUX_USER
WorkingDirectory=/home/YOUR_LINUX_USER/red5-studio/frontend/build
ExecStart=/usr/bin/python3 -m http.server 8080
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now red5-static
sudo systemctl status red5-static
```

Now it runs in the background and survives reboots.

---

## Part 7 — Rebuilding after code changes

Anytime you `git pull` or edit source files:

```bash
cd ~/red5-studio/frontend
yarn build
# If using systemd Python option, no restart needed (static files reload)
# If using Caddy/nginx, also no restart needed.
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `yarn: command not found` | `sudo npm install -g yarn` |
| `JavaScript heap out of memory` during build | `export NODE_OPTIONS="--max-old-space-size=4096"` then re-run `yarn build` |
| `/dashboard.html` shows blank screen | Open browser console — likely a 404 on `/api/auth/me`. Expected without backend. Page shell + Psy chart should still render. |
| `/learn.html` works but `/deepdive.html` shows 404 | Make sure `build/deepdive.html` exists; if not, the build copied only published `public/` files. Run `ls build/*.html` to confirm. |
| Caddy returns 502 | Run `journalctl -u caddy -n 50` — usually a syntax error in Caddyfile or a port conflict on 80. |
| Need to free port 8080 | `sudo lsof -i :8080` then `kill -9 <PID>` |

---

## What about the FastAPI backend?

If you later decide you want the live dashboard + telemetry + auth:

1. Install Python 3.11+ and MongoDB Community Edition
2. `cd backend && pip install -r requirements.txt`
3. Set `MONGO_URL=mongodb://localhost:27017` and `DB_NAME=red5_local` in `backend/.env`
4. Run `uvicorn server:app --host 0.0.0.0 --port 8001`
5. Update frontend's `.env`: `REACT_APP_BACKEND_URL=http://localhost:8001`
6. Rebuild: `yarn build`

A dedicated backend-hosting guide can be added on request.

# Red5 Studio V2.0 — Self-Hosted Deployment Runbook

> **Target server**: Ubuntu 22.04 / 24.04 LTS
> **Service user**: `newborn`
> **Install path**: `/home/red5-studio` (`/home/red5-studio/backend`, `/home/red5-studio/frontend`)
> **MongoDB**: local (`mongodb://localhost:27017`)
> **Frontend**: nginx + Let's Encrypt HTTPS
>
> **Path note**: If you meant `/home/newborn/red5-studio/`, do a global find-and-replace on the path before pasting any commands.

Every phase ends with a **CHECKPOINT** — do not move past it until the verification passes. If a checkpoint fails, stop and ask before continuing.

> **Tunnel / Cloudflare upgrade?**
> If this server fronts the dashboard through a Cloudflare Tunnel and
> you've been seeing intermittent **Error 1033** ("tunnel not connected
> to Cloudflare's network"), run `sudo ./upgrade-cloudflared.sh` from
> the repo root — see [`UPGRADE_CLOUDFLARED.md`](./UPGRADE_CLOUDFLARED.md)
> for what it does + how to roll back.  The script is idempotent and
> safe to re-run; do it once after each `./deploy.sh` until you're on
> 2026.6.0.

---

## Phase 0 — Pre-flight (gather, do not execute)

Confirm these on the server BEFORE touching anything:

```bash
# Identity
whoami                                     # should be your sudo user
id newborn                                 # MUST exist; create if not (Phase 1)
ls /home/                                  # confirm /home/red5-studio is where you want files

# OS
lsb_release -a                             # should say 22.04 or 24.04
uname -m                                   # x86_64 or aarch64

# Resources (V2.0 is light, but worth a sanity check)
free -h                                    # ≥1 GB RAM recommended
df -h /                                    # ≥2 GB free under /
```

**CHECKPOINT 0**: Note OS version, RAM, free disk, and confirm `newborn` user exists (or plan to create them).

---

## Phase 1 — System dependencies

### 1.1 Create the service user (if not yet existing)
```bash
sudo adduser --system --group --home /home/newborn --shell /bin/bash newborn
# If you want to be able to su into them for debugging:
sudo usermod -s /bin/bash newborn
```

### 1.2 Install OS packages
```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip \
                    nginx certbot python3-certbot-nginx \
                    curl git build-essential
```
If `python3.11` isn't available on your Ubuntu version, use `python3` (the system default) — the venv we'll create works with 3.10+.

### 1.3 Install MongoDB Community 7.0
```bash
# Repo
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

**CHECKPOINT 1**:
```bash
mongosh --eval 'db.runCommand({ ping: 1 })'
# Expect: { ok: 1 }
systemctl is-active mongod                 # active
systemctl is-active nginx                  # active
python3 --version                          # 3.10+ or 3.11
```

---

## Phase 2 — File layout & permissions

### 2.1 Create directories
```bash
sudo mkdir -p /home/red5-studio/backend
sudo mkdir -p /home/red5-studio/frontend
sudo mkdir -p /home/red5-studio/logs
sudo chown -R newborn:newborn /home/red5-studio
```

### 2.2 Copy files from your development source
From your dev machine (where `/app/` lives), scp these:
```bash
# Backend (Python sources + requirements + .env template)
scp -r backend/* you@server:/home/red5-studio/backend/

# Frontend (public folder; we serve dashboard.html, js/, css/, assets/, docs/)
scp -r frontend/public/* you@server:/home/red5-studio/frontend/
```

### 2.3 Fix ownership after upload
```bash
sudo chown -R newborn:newborn /home/red5-studio
sudo find /home/red5-studio -type d -exec chmod 755 {} \;
sudo find /home/red5-studio -type f -exec chmod 644 {} \;
```

**CHECKPOINT 2**:
```bash
ls /home/red5-studio/backend/server.py            # exists, owned by newborn
ls /home/red5-studio/backend/requirements.txt     # exists
ls /home/red5-studio/frontend/dashboard.html      # exists
ls /home/red5-studio/frontend/js/psy-3d-engine.js # exists
```

---

## Phase 3 — Python virtualenv + dependencies

```bash
# Switch to service user for everything from here
sudo -u newborn -i

cd /home/red5-studio/backend
python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

**CHECKPOINT 3**:
```bash
which python                                       # /home/red5-studio/backend/venv/bin/python
python -c "import fastapi, motor, bcrypt; print(fastapi.__version__, bcrypt.__version__)"
# Expect: 0.104.1 4.1.3
```

Exit the shell back to your sudo user when done: `exit`.

---

## Phase 4 — `.env` configuration

This is the step where the bcrypt-`$` shell-expansion bug bit you earlier. Three rules to avoid it:

1. Always use **double quotes** around the bcrypt hash in `.env`.
2. Never `export ADMIN_PASSWORD_HASH=$2b$12$...` in a shell — `$2` becomes `""`.
3. Generate the hash *inside the venv*, write it via Python directly to the file.

### 4.1 Generate the admin password hash safely
```bash
sudo -u newborn -i
cd /home/red5-studio/backend
source venv/bin/activate

python <<'PY'
import bcrypt, getpass
pw = getpass.getpass("Admin password (won't echo): ").encode()
print("Hash (paste this VERBATIM into .env, including the surrounding quotes):")
print('ADMIN_PASSWORD_HASH="' + bcrypt.hashpw(pw, bcrypt.gensalt(rounds=12)).decode() + '"')
PY
```
Copy the printed line. Then:

### 4.2 Create `/home/red5-studio/backend/.env`
```bash
nano /home/red5-studio/backend/.env
```
Paste exactly (substitute your admin email + the hash line you just generated):
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=red5_v2_prod
ADMIN_EMAILS=seeker0829@gmail.com
ADMIN_PASSWORD_EMAIL=seeker0829@gmail.com
ADMIN_PASSWORD_HASH="$2b$12$YourGeneratedHashHereDoNotRemoveQuotes"
FRONTEND_ORIGIN=https://your-domain.example.com
```
Notes:
- `DB_NAME` change from `red5_v2_demo` → `red5_v2_prod` is intentional — separate prod data from any demo run.
- `FRONTEND_ORIGIN` MUST match the exact origin (scheme + host, no path, no trailing slash) you'll hit the dashboard from. Required for the auth cookie. If wrong, login appears to succeed but the cookie is rejected.
- The quotes around the bcrypt hash are not optional.

### 4.3 Lock down permissions
```bash
chmod 600 /home/red5-studio/backend/.env       # only newborn can read
```

**CHECKPOINT 4**:
```bash
sudo -u newborn cat /home/red5-studio/backend/.env | grep -c '^[A-Z_]*=' 
# Expect: 6   (six non-blank settings)

# Verify hash decodes correctly
sudo -u newborn -i
cd /home/red5-studio/backend && source venv/bin/activate
python <<'PY'
import os, bcrypt
from dotenv import load_dotenv; load_dotenv()
h = os.environ.get("ADMIN_PASSWORD_HASH","")
print("hash starts with $2b$:", h.startswith("$2b$"))
print("hash length:", len(h), "(should be 60)")
PY
```
If `hash starts with $2b$` prints `False`, the shell ate the `$2b` — fix your `.env` before continuing.

---

## Phase 5 — Manual smoke test (uvicorn in foreground)

Do this BEFORE setting up systemd. If uvicorn won't start by hand, systemd won't save you.

```bash
sudo -u newborn -i
cd /home/red5-studio/backend
source venv/bin/activate

# Foreground; Ctrl-C to stop
uvicorn server:app --host 127.0.0.1 --port 8001
```

In a SECOND ssh window:
```bash
curl -s http://127.0.0.1:8001/api/health
# Expect JSON: {"status":"ok",...}

curl -s http://127.0.0.1:8001/api/version
# Expect JSON: {"version":"2.0.0-phase...","fork":"V2.0"}

# Login round-trip
curl -i -X POST http://127.0.0.1:8001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"seeker0829@gmail.com","password":"YOUR_REAL_PASSWORD"}'
# Expect: 200 OK + a `Set-Cookie: session=...` header
```

**CHECKPOINT 5**: All three curl calls succeed. Then `Ctrl-C` in the uvicorn window.

If `/api/auth/login` returns 401 → your `.env` ADMIN_PASSWORD_HASH does not match the password you just typed. Re-run Phase 4.1 with the right password.

---

## Phase 6 — systemd service

### 6.1 Create the unit file
```bash
sudo nano /etc/systemd/system/red5-backend.service
```
Paste:
```ini
[Unit]
Description=Red5 Studio V2.0 FastAPI backend
After=network-online.target mongod.service
Wants=network-online.target
Requires=mongod.service

[Service]
Type=simple
User=newborn
Group=newborn
WorkingDirectory=/home/red5-studio/backend
EnvironmentFile=/home/red5-studio/backend/.env
ExecStart=/home/red5-studio/backend/venv/bin/uvicorn server:app \
          --host 127.0.0.1 --port 8001 --workers 2 --proxy-headers \
          --forwarded-allow-ips 127.0.0.1
Restart=on-failure
RestartSec=5
StandardOutput=append:/home/red5-studio/logs/backend.out.log
StandardError=append:/home/red5-studio/logs/backend.err.log

# Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=read-only
ReadWritePaths=/home/red5-studio/logs /home/red5-studio/backend/.env

[Install]
WantedBy=multi-user.target
```
Key points:
- `--workers 2` is a safe starting point. Move up to 4 once you confirm the V2.0 backend handles your load. Workers > 1 with in-memory state can confuse some endpoints — if you hit oddities, set `--workers 1` first.
- `--proxy-headers` lets FastAPI trust the `X-Forwarded-*` headers nginx will send (critical for cookie domains and brute-force IP tracking).
- `ProtectHome=read-only` + explicit `ReadWritePaths` blocks the service from writing anywhere outside `/home/red5-studio/logs` and the `.env` (which you don't want it to write either, but it needs read access).

### 6.2 Enable + start
```bash
sudo systemctl daemon-reload
sudo systemctl enable red5-backend.service
sudo systemctl start red5-backend.service
```

### 6.3 Verify
```bash
sudo systemctl status red5-backend.service           # active (running), no failures
sudo journalctl -u red5-backend.service -n 30 --no-pager
curl -s http://127.0.0.1:8001/api/health             # same JSON as Phase 5
```

**CHECKPOINT 6**:
```bash
sudo systemctl is-active red5-backend.service        # active
sudo systemctl is-enabled red5-backend.service       # enabled
# Reboot test (one-time): sudo reboot, then SSH back and re-run is-active.
```

---

## Phase 7 — nginx + HTTPS

### 7.1 nginx site config
```bash
sudo nano /etc/nginx/sites-available/red5
```
Paste (replace `your-domain.example.com` with your actual domain — and yes, you DO need DNS pointing at this server before Phase 7.3):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.example.com;

    # certbot will fill HTTPS in for us in Phase 7.3 -- leaving 80 here for the ACME challenge.
    location /.well-known/acme-challenge/ { root /var/www/html; }

    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.example.com;

    # certbot will inject ssl_certificate / ssl_certificate_key lines here.

    # Static frontend (dashboard.html, js/, css/, assets/, docs/)
    root /home/red5-studio/frontend/build;
    index index.html;

    # Larger uploads (mapper config posts, plugin uploads, etc.)
    client_max_body_size 32m;

    # GET / → Access Control (V1.9 parity).  Without this, try_files falls
    # through to /dashboard.html and operators land on the dashboard unsigned.
    location = / {
        rewrite ^ /access.html last;
    }

    # All /api/* goes to uvicorn
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # /assets/<path> also goes to uvicorn (V1.9 compatibility alias the backend exposes)
    location /assets/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Everything else: try the file on disk, fall back to the CRA shell.
    # (Do NOT fall back to /dashboard.html — that bypasses Access Control.)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Avoid serving the bcrypt hash by accident
    location ~ /\.env { deny all; return 404; }
    location ~ /\.git { deny all; return 404; }
}
```

### 7.2 Enable site
```bash
sudo ln -s /etc/nginx/sites-available/red5 /etc/nginx/sites-enabled/red5
sudo rm -f /etc/nginx/sites-enabled/default        # if it exists
sudo nginx -t                                       # syntax check
sudo systemctl reload nginx
```

### 7.3 Let's Encrypt HTTPS
DNS for `your-domain.example.com` MUST point to this server's public IP first.
```bash
sudo certbot --nginx -d your-domain.example.com \
      --redirect --hsts --staple-ocsp \
      --email seeker0829@gmail.com --agree-tos --no-eff-email
```
Certbot will edit your nginx config in-place to add the cert lines and the 80→443 redirect.

**CHECKPOINT 7**:
```bash
curl -I https://your-domain.example.com/api/health
# Expect: HTTP/2 200, content-type application/json

curl -I https://your-domain.example.com/dashboard.html
# Expect: HTTP/2 200, content-type text/html

# Cert auto-renew (no action needed — certbot installs a timer):
sudo systemctl list-timers | grep certbot
```

Update `FRONTEND_ORIGIN` in `.env` if it was `http://...` placeholder earlier:
```bash
sudo -u newborn sed -i 's|^FRONTEND_ORIGIN=.*|FRONTEND_ORIGIN=https://your-domain.example.com|' /home/red5-studio/backend/.env
sudo systemctl restart red5-backend.service
```

---

## Phase 8 — End-to-end verification

In a browser, open `https://your-domain.example.com/dashboard.html` and run through:

| Test | Expected | If fails |
|---|---|---|
| Page loads, no console errors | Dashboard renders | Check `journalctl -u red5-backend -f` + browser devtools |
| Login as `seeker0829@gmail.com` | Top-right shows your email, not "GUEST" | Phase 4 hash or Phase 7 `FRONTEND_ORIGIN` mismatch |
| 3D WX tab → 11 preset buttons visible | All 11 cities in preset row | Frontend not re-uploaded — re-run Phase 2.2 |
| Save a custom location | Reappears in dropdown after refresh | Check Mongo: `mongosh red5_v2_prod --eval 'db.tenant_locations.find().pretty()'` |
| Monthly × Sites Comparison toggle | Chart renders saved + presets | Check `/api/weather-history` reachability |
| Reboot the server: `sudo reboot` | Dashboard reachable within ~60s of boot | `systemctl status` on red5-backend + mongod + nginx |

**CHECKPOINT 8**: All 6 tests pass.

---

## Phase 9 — Rollback / disable / recovery

### Stop the service
```bash
sudo systemctl stop red5-backend.service
sudo systemctl disable red5-backend.service       # don't start on next boot
```

### Roll the backend back to a previous version
Before deploying a new version, snapshot the current state:
```bash
sudo -u newborn cp -r /home/red5-studio/backend /home/red5-studio/backend.$(date +%Y%m%d-%H%M%S)
```
Restore:
```bash
sudo systemctl stop red5-backend.service
sudo -u newborn rm -rf /home/red5-studio/backend
sudo -u newborn mv /home/red5-studio/backend.20260525-1430 /home/red5-studio/backend
sudo systemctl start red5-backend.service
```

### Snapshot + restore MongoDB
Before each prod-data-touching deploy:
```bash
mkdir -p /home/newborn/mongo-dumps
mongodump --uri "mongodb://localhost:27017" --db red5_v2_prod \
          --out /home/newborn/mongo-dumps/$(date +%Y%m%d-%H%M%S)
```
Restore the latest:
```bash
mongorestore --uri "mongodb://localhost:27017" --drop \
             --nsInclude 'red5_v2_prod.*' \
             /home/newborn/mongo-dumps/20260525-1430
```

### Tail logs while debugging
```bash
sudo journalctl -u red5-backend.service -f          # systemd stdout
tail -f /home/red5-studio/logs/backend.err.log      # python tracebacks
tail -f /var/log/nginx/access.log                   # request log
tail -f /var/log/nginx/error.log                    # nginx errors
```

---

## Common mistakes & how to avoid them

1. **`.env` bcrypt hash starts with literal `$2b$` but server still rejects login**
   The hash was generated against a DIFFERENT password than you're typing. Regenerate via Phase 4.1.

2. **Login succeeds in curl, fails in browser** ("logged in but stuck on guest")
   `FRONTEND_ORIGIN` in `.env` does not exactly match the origin in your browser address bar. Must include `https://` and no trailing slash.

3. **`502 Bad Gateway` from nginx**
   Backend is not running, or is on a different port than `127.0.0.1:8001`. Check `systemctl status red5-backend`.

4. **`410 Gone` or `connection refused` after reboot**
   `mongod` came up slower than the backend. The `Requires=mongod.service` in our unit handles this, but if you see it: `sudo systemctl restart red5-backend`.

5. **Frontend file changes don't show up after re-upload**
   Browsers cache hard. Hard-refresh (Cmd-Shift-R or Ctrl-F5) once, or bump a query string on the script tag in `dashboard.html`.

6. **`mongod` won't start after a power loss**
   `sudo rm /var/lib/mongodb/mongod.lock && sudo systemctl start mongod` — last resort; lose the journal but recover the data.

---

## Future hardening (P2 — not blocking deploy)

- **Backups**: cron a nightly `mongodump` to an off-box location (S3, another server).
- **Firewall**: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`.
- **Fail2ban** on `/api/auth/login` — the brute-force protection is in-app, but fail2ban on the nginx access log adds a second layer.
- **Log rotation**: `/etc/logrotate.d/red5-backend` for the files in `/home/red5-studio/logs/`.
- **MongoDB auth**: switch from `mongodb://localhost:27017` (anonymous) to a user-restricted role once you're past the "just make it work" phase.

---

*End of runbook. Generated 2026-05-26.*

# Genius Mason — Deployment Guide

Step-by-step guide to host the public educational psychrometric chart at
**https://geniusmason.com** and track visitors with self-hosted Umami.

The page itself is **fully static** — one HTML file + one JS file. No
backend, no database, no build step. It will run identically on:
- Netlify (drag-and-drop)
- Vercel
- GitHub Pages
- A Raspberry Pi running Python's built-in HTTP server
- Any web host that serves static files

---

## Part 1 — Files you need

Two files from this repo:
```
/app/frontend/public/learn.html
/app/frontend/public/js/psychrometric.js
```

Copy them into a fresh folder on your computer, preserving the folder
structure:
```
my-site/
├── learn.html                ← rename to index.html when uploading
└── js/
    └── psychrometric.js
```

> When you upload, **rename `learn.html` → `index.html`** so visitors
> can land on `https://geniusmason.com/` directly without typing the
> filename.

---

## Part 2 — Choose a host

### Option A — Netlify (5 minutes, free, recommended for first launch)

1. Sign up at **https://app.netlify.com** (free).
2. Open **https://app.netlify.com/drop** in your browser.
3. **Drag the `my-site` folder onto the page.**
4. Netlify gives you a temporary URL like
   `https://wondrous-fox-12345.netlify.app` — open it. You should see
   the chart.
5. In the Netlify dashboard for that site, click **Domain settings →
   Add custom domain → `geniusmason.com`** and follow the DNS wizard.
   You'll be told to add two DNS records at your domain registrar
   (Namecheap / Porkbun / GoDaddy etc.).  Saving them takes ~15 min to
   propagate.
6. Done. https://geniusmason.com is live and free.

### Option B — Raspberry Pi at home (free, self-hosted)

1. Copy `my-site/` onto the Pi:
   ```bash
   scp -r my-site/ pi@raspberrypi.local:~/my-site/
   ```
2. SSH to the Pi and install Caddy (the easiest web server with
   automatic HTTPS):
   ```bash
   sudo apt update
   sudo apt install -y caddy
   ```
3. Replace `/etc/caddy/Caddyfile` with:
   ```
   geniusmason.com {
       root * /home/pi/my-site
       file_server
       try_files {path} /index.html
   }
   ```
4. Restart Caddy:
   ```bash
   sudo systemctl restart caddy
   ```
5. **Open Caddy to the internet** — easiest way is Cloudflare Tunnel
   (free, no router port-forwarding):
   ```bash
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o cloudflared
   sudo install cloudflared /usr/local/bin/
   cloudflared tunnel login
   cloudflared tunnel create geniusmason
   cloudflared tunnel route dns geniusmason geniusmason.com
   cloudflared tunnel run geniusmason
   ```

   To keep the tunnel running on reboot:
   ```bash
   sudo cloudflared service install
   ```
6. Done. https://geniusmason.com points to your Pi via Cloudflare's edge
   network — HTTPS is free and your home IP stays private.

---

## Part 3 — Add visitor analytics (Umami, self-hosted on your Pi)

Umami is privacy-first analytics: no cookies, no fingerprinting, no
GDPR / CCPA cookie banner required.  Free, open-source, runs in Docker.

### 1. Install Docker on the Pi

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker pi
newgrp docker
```

### 2. Spin up Umami + Postgres with one file

Create `~/umami/docker-compose.yml`:
```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:CHANGE_THIS@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: CHANGE_THIS_TO_A_LONG_RANDOM_STRING
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: CHANGE_THIS
    volumes:
      - ./umami-db:/var/lib/postgresql/data
    restart: unless-stopped
```

Run it:
```bash
cd ~/umami
docker compose up -d
```

Wait ~60 seconds for the database to initialize, then visit
`http://raspberrypi.local:3000`.

### 3. First-time setup

- Default login: **admin / umami**
- **Change the password immediately.**
- Click **Add Website**, name it "Genius Mason", domain
  `geniusmason.com`. Save.
- Click into the new website and copy the **Tracking code** —
  it'll look like:
  ```html
  <script defer src="https://YOUR_HOST/script.js" data-website-id="abc-123-..."></script>
  ```

### 4. Expose Umami over HTTPS

Add a second site block to your Caddyfile so Umami is reachable at a
public URL (e.g. `analytics.geniusmason.com`):
```
analytics.geniusmason.com {
    reverse_proxy localhost:3000
}
```
Restart Caddy: `sudo systemctl restart caddy`.

Add `analytics.geniusmason.com` to your Cloudflare Tunnel as well.

### 5. Wire the tracking script into the page

In `my-site/index.html`, find this comment block near the top:
```html
<!--
<script defer
        src="https://YOUR_PI_DOMAIN/script.js"
        data-website-id="YOUR_WEBSITE_ID"></script>
-->
```

Uncomment it and replace with your real values:
```html
<script defer
        src="https://analytics.geniusmason.com/script.js"
        data-website-id="abc-123-your-real-id"></script>
```

Save and re-deploy (drag the folder onto Netlify again, or `scp` it to
the Pi).

### 6. Confirm

Visit your site once, then refresh the Umami dashboard.  You should
see **1 visit** with country, OS, browser, screen size, time on page,
and which buttons got clicked (the audience switcher fires a custom
`audience_switch` event).

---

## Part 4 — Optional polish

### Custom 404 page
Create a `404.html` next to `index.html` that gracefully sends visitors
back to `/`.

### Sitemap + robots.txt (helps SEO)
Drop a `robots.txt` containing:
```
User-agent: *
Allow: /
Sitemap: https://geniusmason.com/sitemap.xml
```
And a minimal `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://geniusmason.com/</loc></url>
</urlset>
```

### Social-share preview image
Add a 1200×630 PNG named `og-image.png` and reference it in
`<head>`:
```html
<meta property="og:image" content="https://geniusmason.com/og-image.png">
```

---

## Part 5 — Where to go next

When this page is live and you've seen ~50+ visitors, the natural
follow-up is to **add the Pro View** — a button on the educational page
that opens the full multi-AHU live diagnostic (this repo's
`/dashboard.html`).  That gives building owners a way to "see the real
thing" once the educational page has hooked them.

That's Phase G — happy to ship it whenever you're ready.

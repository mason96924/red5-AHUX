# Exposing the V3.0 demo via nginx (elc.dcred5-studio.com → 127.0.0.1:8888)

The V3.0 demo binds by default to `127.0.0.1:8888` — perfect for a
same-box nginx reverse proxy.  This doc captures the operator-verified
nginx server block, the SSE-specific gotchas, and the diagnostic flow
for `502 Bad Gateway` errors.

## 0. Prerequisites

1. DNS `A` record: `elc.dcred5-studio.com` → your public IP.
   Verify: `dig +short elc.dcred5-studio.com` on any box.
2. Public 80/443 open on your router / cloud firewall.
3. `demo.py` running on the box that nginx also runs on
   (or set `DEMO_HOST=0.0.0.0` and adjust the `proxy_pass` upstream to
   point at a private LAN IP).

## 1. Server block

Place in `/etc/nginx/sites-available/elc.dcred5-studio.com` and
symlink into `sites-enabled/`.

```nginx
# HTTP -> HTTPS redirect (Let's Encrypt HTTP-01 also lives here)
server {
    listen 80;
    listen [::]:80;
    server_name elc.dcred5-studio.com;

    # Certbot ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name elc.dcred5-studio.com;

    ssl_certificate     /etc/letsencrypt/live/elc.dcred5-studio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elc.dcred5-studio.com/privkey.pem;

    # ---- SSE stream (/api/elc/events-sse) ----------------------------
    # THIS BLOCK IS CRITICAL.  If you skip proxy_buffering off + long
    # timeout, live relay updates freeze after ~60s of idle and the UI
    # dots stop tracking the real hardware state.
    location /api/elc/events-sse {
        proxy_pass         http://127.0.0.1:8888;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Connection        "";       # keep-alive
        proxy_buffering    off;                       # no chunk buffering
        proxy_cache        off;
        proxy_read_timeout 24h;                       # SSE is long-lived
        proxy_send_timeout 24h;
        chunked_transfer_encoding off;
    }

    # ---- Everything else ---------------------------------------------
    location / {
        proxy_pass         http://127.0.0.1:8888;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        client_max_body_size 20m;   # generous room for future DXF uploads
    }
}
```

## 2. Get the TLS cert

```bash
sudo certbot --nginx -d elc.dcred5-studio.com --agree-tos -m you@dcred5-studio.com
```

Certbot will edit the config in place; the block above already
anticipates that so no follow-up edit is needed.

## 3. Enable + test + reload

```bash
sudo ln -s /etc/nginx/sites-available/elc.dcred5-studio.com \
           /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Verify

From any external box:
```bash
curl -I https://elc.dcred5-studio.com/floor            # expect 200
curl -N https://elc.dcred5-studio.com/api/elc/events-sse   # expect the SSE stream to
                                                            # start yielding events; Ctrl-C
                                                            # to close
```

## 5. Common causes of `502 Bad Gateway`

| Symptom | Root cause | Fix |
|---|---|---|
| `demo.py` not running | (obvious) | Start it — see `RED5-ELC V3.0 demo` boot banner |
| `demo.py` bound only to `127.0.0.1` on box A, nginx on box B | `curl -v http://127.0.0.1:8888/` from nginx box fails | `export DEMO_HOST=0.0.0.0` on the demo box + update firewall |
| `proxy_pass` targets wrong port (e.g. 8000) | check `/var/log/nginx/error.log` for `connect() failed` | Fix port |
| SELinux blocks nginx → localhost | `ausearch -m avc \| grep httpd_can_network_connect` | `sudo setsebool -P httpd_can_network_connect 1` |
| SSE freezes after ~60s | `proxy_buffering` / `proxy_read_timeout` defaults | Use the SSE block above |
| CORS errors in browser console | mixed http/https or wrong X-Forwarded-Proto | Ensure `proxy_set_header X-Forwarded-Proto $scheme;` is set |

## 6. Diagnostic one-liner (from the demo box)

If you already see `502` in your browser, run this from the demo box:

```bash
curl -sv http://127.0.0.1:8888/floor 2>&1 | head -20
```

* If this returns HTML → demo.py is fine, the problem is nginx.
* If this hangs / refuses → demo.py isn't running or bound to a
  different interface.  Check the boot banner and `DEMO_HOST`.

Then from the nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
```
Hit the public URL in your browser and watch for the exact
`connect() failed` / `upstream prematurely closed` line — that
diagnoses 90 % of `502`s in seconds.

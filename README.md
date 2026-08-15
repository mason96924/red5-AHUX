# Red5-AHUX

Fork of [red5-ahu](https://github.com/mason96924/red5-ahu) that keeps the AHU dashboard and adds **red5-elc** floor geometry:

- **Trace Room** / **+ Window** / **Trace Window** / **Trace Concrete** / **N/S/W/E** — same layout tools as ELC `floor.html`
- **Sun Path** painted on the floor image (ELC sky-dome), not the AHU Sun-Dial compass
- **Window graphic modal** — AHU equipment-diagram chrome with ELC window options (blind type, open %, length, height, 3D aligner, 2D aperture)

`red5-ahu` is left untouched. This tree started as a clone of that repo.

## Mapper

Open `equipment_mapper.html` → Floor Plan:

1. Upload a floor image
2. Trace rooms, place or trace windows, optional concrete + N/S/W/E rose
3. Toggle **Sun path: On** — the dome sits on the plan, aligned to the rose
4. Click a window to open its graphic modal

## Dashboard

The live floor-plan modal uses the same Sun Path overlay. Click a window for the graphic modal (blinds + aligner).

## GitHub

```bash
cd /Users/jinkim/red5/red5-AHUX

git add frontend/public/js/elc-sun-path-overlay.js \
        frontend/public/js/dashboard/window-graphic-modal.js \
        frontend/public/js/dashboard/floor-plan-modal.js \
        frontend/public/js/dashboard/app.js \
        frontend/public/equipment_mapper.html \
        frontend/public/dashboard.html \
        frontend/src/dashboard/build.sh \
        README.md

git commit -m "$(cat <<'EOF'
Port ELC room/window creation and floor Sun Path into AHUX.

Replace the AHU Sun-Dial compass with ELC's sky-dome on the floor
image, and open windows in an AHU-style graphic modal with full
blind/aligner/aperture options.
EOF
)"

git remote add origin https://github.com/mason96924/red5-AHUX.git
git push -u origin main
```

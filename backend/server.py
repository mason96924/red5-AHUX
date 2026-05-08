"""Minimal FastAPI stub exposing /api/weather-location for the preview env.
The production controller uses /app/archive/Red5-Studio-V1.8/app.py (Flask).
This stub only returns the four user-saved hospital locations so the 2D
Monthly \u00d7 Sites visualization can be screenshot-tested."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"],
)

SAVED = [
    {"lat": -34.92, "lon": 138.60, "name": "NRAH (Adelaide)"},
    {"lat": -31.95, "lon": 115.86, "name": "Perth Children Hospital"},
    {"lat":  37.56, "lon": 127.04, "name": "Hanyang Univ Hospital (Seoul)"},
    {"lat":  39.91, "lon": 116.40, "name": "Beijing Geriatric Hospital"},
]

@app.get("/api/weather-location")
async def get_weather_location():
    return {"active": SAVED[0], "saved": SAVED}


@app.get("/api/health")
async def health():
    return {"ok": True}

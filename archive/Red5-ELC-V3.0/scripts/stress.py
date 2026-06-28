#!/usr/bin/env python3
"""Headless stress test for Red5-ELC.

Fires N relay writes against a running demo and reports throughput +
WS event-arrival rate.  Useful for soak testing without a browser.

Examples:

    # Default: 100 relays, all-on then all-off, against the local demo
    python scripts/stress.py

    # 500 relays, randomize 5 times, against a remote demo
    python scripts/stress.py --base https://example.com --n 500 --rounds 5 \\
                             --mode random

    # Pound it: tight loop of toggles for 30 s
    python scripts/stress.py --mode chaos --duration 30
"""

from __future__ import annotations

import argparse
import asyncio
import contextlib
import random
import sys
import time
from urllib.parse import urlparse

import httpx
import websockets


def device_id(i: int) -> str:
    return f"SRM/1/{100 + i}/0"


async def post_relay(client: httpx.AsyncClient, base: str, dev: str, state: bool) -> bool:
    try:
        r = await client.post(f"{base}/api/elc/devices/{dev}/relay", json={"state": state})
        return r.status_code == 200
    except Exception:
        return False


async def listen_ws(ws_url: str, stop: asyncio.Event, counters: dict) -> None:
    try:
        async with websockets.connect(ws_url, max_size=2**20) as ws:
            while not stop.is_set():
                try:
                    raw = await asyncio.wait_for(ws.recv(), timeout=0.5)
                except asyncio.TimeoutError:
                    continue
                counters["events"] += 1
    except Exception as e:
        print(f"[ws] {e}", file=sys.stderr)


async def fire_batch(client, base, n, plan) -> tuple[int, float]:
    t0 = time.perf_counter()
    tasks = [post_relay(client, base, device_id(i), plan(i)) for i in range(n)]
    ok = sum(1 for r in await asyncio.gather(*tasks) if r)
    dt = time.perf_counter() - t0
    return ok, dt


async def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default="http://127.0.0.1:8765",
                    help="Demo base URL (default: %(default)s)")
    ap.add_argument("-n", "--n", type=int, default=100,
                    help="Number of relays (default: %(default)s)")
    ap.add_argument("--mode", choices=["onoff", "random", "toggle", "chaos"],
                    default="onoff",
                    help="onoff = N×ON then N×OFF;  random = N×random state;  "
                         "toggle = flip each;  chaos = tight loop until --duration")
    ap.add_argument("--rounds", type=int, default=2,
                    help="Number of batches (ignored for chaos)")
    ap.add_argument("--duration", type=float, default=10.0,
                    help="Seconds (chaos mode only)")
    args = ap.parse_args()

    base = args.base.rstrip("/")
    parsed = urlparse(base)
    ws_proto = "wss" if parsed.scheme == "https" else "ws"
    ws_url = f"{ws_proto}://{parsed.netloc}/api/elc/events"

    counters = {"events": 0}
    stop = asyncio.Event()
    ws_task = asyncio.create_task(listen_ws(ws_url, stop, counters))

    print(f"target  : {base}")
    print(f"ws      : {ws_url}")
    print(f"N       : {args.n} relays")
    print(f"mode    : {args.mode}")
    print()

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Confirm reachable.
        try:
            r = await client.get(f"{base}/api/elc/link")
            r.raise_for_status()
            link = r.json()
            print(f"link    : {link['state']} (host={link['host']}:{link['port']})")
        except Exception as e:
            print(f"link    : UNREACHABLE — {e}", file=sys.stderr)
            stop.set()
            await ws_task
            return 1

        await asyncio.sleep(0.3)   # let WS subscribe before we start firing

        # Track WS events around each batch for arrival lag.
        if args.mode == "onoff":
            for r in range(args.rounds):
                for desired in (True, False):
                    before = counters["events"]
                    ok, dt = await fire_batch(client, base, args.n, lambda _i: desired)
                    await asyncio.sleep(0.3)
                    got = counters["events"] - before
                    eps = ok / dt if dt else 0.0
                    print(
                        f"round {r+1}/{args.rounds}  {'ON ' if desired else 'OFF'}  "
                        f"posts={ok}/{args.n}  {dt*1000:7.0f} ms  "
                        f"({eps:6.0f} POST/s)   ws events recv={got}"
                    )
        elif args.mode == "random":
            for r in range(args.rounds):
                before = counters["events"]
                ok, dt = await fire_batch(client, base, args.n, lambda _i: random.random() < 0.5)
                await asyncio.sleep(0.3)
                got = counters["events"] - before
                eps = ok / dt if dt else 0.0
                print(
                    f"round {r+1}/{args.rounds}  RND  posts={ok}/{args.n}  "
                    f"{dt*1000:7.0f} ms  ({eps:6.0f} POST/s)   ws events recv={got}"
                )
        elif args.mode == "toggle":
            states = [False] * args.n
            for r in range(args.rounds):
                before = counters["events"]
                ok, dt = await fire_batch(client, base, args.n, lambda i: not states[i])
                states = [not s for s in states]
                await asyncio.sleep(0.3)
                got = counters["events"] - before
                eps = ok / dt if dt else 0.0
                print(
                    f"round {r+1}/{args.rounds}  TGL  posts={ok}/{args.n}  "
                    f"{dt*1000:7.0f} ms  ({eps:6.0f} POST/s)   ws events recv={got}"
                )
        else:   # chaos
            print(f"chaos mode — random flips for {args.duration}s")
            deadline = time.perf_counter() + args.duration
            posts = 0
            t0 = time.perf_counter()
            before = counters["events"]
            while time.perf_counter() < deadline:
                # Burst of ~N/20 flips every ~50 ms.
                k = max(1, args.n // 20)
                batch = [post_relay(client, base, device_id(random.randrange(args.n)),
                                    random.random() < 0.5)
                         for _ in range(k)]
                ok = sum(1 for r in await asyncio.gather(*batch) if r)
                posts += ok
                await asyncio.sleep(0.05)
            dt = time.perf_counter() - t0
            await asyncio.sleep(0.5)
            got = counters["events"] - before
            print(f"chaos   : {posts} posts in {dt:.1f}s "
                  f"({posts/dt:.0f} POST/s)   ws events recv={got}")

    stop.set()
    with contextlib.suppress(Exception):
        await asyncio.wait_for(ws_task, timeout=2.0)

    print()
    print(f"total ws events observed: {counters['events']}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(asyncio.run(main()))
    except KeyboardInterrupt:
        print("\ninterrupted.")
        sys.exit(130)

# Data Bridges — Setup Guide for Beginners

A **data bridge** is just a pipe. The controller knows what's happening with your AHUs (supply temp, fan speed, etc.). A bridge sends that information out somewhere else — like a smart-home app, a website, or another building controller.

You don't need to know how the pipe works inside. You just need to fill in **two or three blanks** and flip a switch.

There are four pipes available. Pick the one your other system already uses. If you're not sure, **Webhook** is the easiest.

---

## 1. HTTP Webhook — "POST it to a URL"

**Use when**: You have any system that can receive an HTTP POST. Examples: n8n, Make.com, Grafana Cloud, a simple Python script, your own website.

**What you fill in**:

```json
"webhook": {
  "enabled": true,
  "url": "https://your-website.com/ahu-data",
  "bearer_token": "abc123-secret",
  "publish_interval_s": 30,
  "timeout_s": 5
}
```

**That's it.** Every 30 seconds the controller will POST a JSON blob to your URL. If you set a `bearer_token`, the controller adds a header `Authorization: Bearer abc123-secret` so your server knows it's really us.

**What your server gets**:

```json
{
  "ts": 1739200000,
  "controller": "red5",
  "telemetry": {
    "ahu": {
      "AHU01": {"sa_t": 13.2, "ra_t": 22.4, "oa_t": 8.1, "fan_speed": 65, "band": "B5"}
    }
  }
}
```

**To test it without writing any server code**: use [webhook.site](https://webhook.site). Paste the URL it gives you into `webhook.url`, click Test Fire, and you'll see the message arrive.

---

## 2. MQTT — "Talk to my smart-home hub"

**Use when**: You have **Home Assistant**, **Node-RED**, **OpenHAB**, **EMQX**, or any "smart-home" or IoT platform. They all speak MQTT.

**What you fill in**:

```json
"mqtt": {
  "enabled": true,
  "broker_host": "192.168.1.50",
  "broker_port": 1883,
  "tls": false,
  "username": "homeassistant",
  "password": "your-password",
  "topic_prefix": "controller/red5",
  "publish_interval_s": 30,
  "qos": 1,
  "write_allowlist": []
}
```

**Translation in plain English**:
- `broker_host` is the IP address or DNS name of your Home Assistant / Mosquitto / etc.
- `1883` is the standard "no encryption" port. Use `8883` and `tls: true` if your broker has a certificate.
- `username` / `password` are what you'd use to log in to the broker. Leave both empty `""` if your broker doesn't require login.
- `topic_prefix` is just a label — pick anything. The controller will publish to `<topic_prefix>/telemetry`. So in Home Assistant, subscribe to `controller/red5/telemetry`.

**What Home Assistant sees**: same JSON as the Webhook example above, on the `controller/red5/telemetry` topic, every 30 seconds.

**One-time install on the controller**:

```
pip install paho-mqtt
```

If you skip the install, the bridge stays disabled and the UI shows "LIB MISSING" — no harm done.

### Want to send commands BACK to the controller?

By default, MQTT is read-only — no one can push setpoints to your AHUs. To allow remote setpoint changes, add specific BACnet object-IDs to `write_allowlist`:

```json
"write_allowlist": ["AV1", "AV2"]
```

Now if Home Assistant publishes `22.5` to `controller/red5/write/AV1`, the controller writes 22.5°C to BACnet object AV1. Anything NOT in the list is refused. **Empty list = no remote writes possible.**

---

## 3. Modbus TCP — "Talk to my BMS / SCADA panel"

**Use when**: You have an existing **Building Management System** (Honeywell, Siemens, Tridium Niagara, Schneider, JCI Metasys, etc.) with a Modbus TCP master that's already polling other devices.

**What you fill in**:

```json
"modbus": {
  "enabled": true,
  "host": "0.0.0.0",
  "port": 5020,
  "unit_id": 1
}
```

**That's it.** The controller becomes a Modbus slave. Your BMS polls it like any other Modbus device.

**Configure your BMS to read** (per AHU):

| Register | Meaning | Format |
|---|---|---|
| 0  | Supply Air dry-bulb °C × 10 | signed int16 |
| 1  | Return Air dry-bulb °C × 10 | signed int16 |
| 2  | Outside Air dry-bulb °C × 10 | signed int16 |
| 3  | Supply Air RH % | uint16 (0-100) |
| 4  | Return Air RH % | uint16 (0-100) |
| 5  | Outside Air RH % | uint16 (0-100) |
| 6  | Fan speed % | uint16 (0-100) |
| 7  | OA damper position % | uint16 (0-100) |
| 8  | Heating valve % | uint16 (0-100) |
| 9  | Cooling valve % | uint16 (0-100) |
| 10 | Band number (1-10) | uint16 |
| 11-15 | reserved | — |

For AHU #2, registers 16–31. AHU #3, 32–47. Multiply by 16.

**Why is `port: 5020` instead of the usual 502?** Standard Modbus port (502) requires root privileges. 5020 doesn't, so it works without messing with system permissions. Just set the same `5020` on the BMS side.

**One-time install**:

```
pip install pymodbus
```

**Test Fire** writes the value `51966` (`0xCAFE`) to register **999**. On your BMS, add a one-time read of register 999 and check that you see 51966 — that proves your BMS is talking to the right slave.

---

## 4. WebSocket — "I'm building a custom dashboard"

**Use when**: You're writing a **custom web app** (React, Vue, plain JS) that wants live updates. WebSockets keep one connection open forever and the controller pushes updates through it.

**What you fill in**:

```json
"websocket": {
  "enabled": true,
  "host": "0.0.0.0",
  "port": 5021,
  "write_allowlist": []
}
```

**Connect from your web app**:

```javascript
const ws = new WebSocket('ws://controller-ip:5021/');
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log('Telemetry update:', msg.telemetry);
  // msg.telemetry.ahu.AHU01.sa_t etc.
};
```

The controller pushes the same JSON blob (see Webhook example) to every connected client every few seconds.

**Want to send commands back?** Same `write_allowlist` rule as MQTT. Then in your web app:

```javascript
ws.send(JSON.stringify({cmd: 'write', object_id: 'AV1', value: 22.5}));
```

**One-time install**:

```
pip install websockets
```

---

## How to test that it actually works

After you fill in the config and flip the switch ON, click the **Test Fire** button next to that bridge. The controller will immediately fire one message of the right format so you can verify the receiving side parses it correctly — instead of waiting 30 seconds for the next regular publish.

- **Webhook**: posts a `{"test": true, ...}` payload to your URL
- **MQTT**: publishes one message to `<topic_prefix>/test`
- **Modbus**: writes `0xCAFE` (51966) to register 999
- **WebSocket**: broadcasts `{"hello": "world", "test": true, ...}` to connected clients

If Test Fire reports OK and your downstream system receives the message, you're done — flip back to the regular bridge and let the 30-second cycle do its thing.

---

## Quick decision tree

| Question | Answer | Use this bridge |
|---|---|---|
| Do you have Home Assistant or Node-RED? | Yes | **MQTT** |
| Do you have a BMS panel that already speaks Modbus? | Yes | **Modbus TCP** |
| Are you building a custom web app with live updates? | Yes | **WebSocket** |
| Anything else (n8n, Splunk, Grafana, custom REST endpoint, webhook.site)? | Default | **Webhook** |

When in doubt, **start with Webhook + webhook.site**. You'll see your first AHU data on the internet within 60 seconds and zero installs.

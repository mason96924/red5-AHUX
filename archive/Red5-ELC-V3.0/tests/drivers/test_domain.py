"""Domain-layer tests — EventBus + Replica + DeviceId parsing."""

from __future__ import annotations

import asyncio

import pytest

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import FailReport, RelayState
from elc.domain.bus import EventBus
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver


def _dev(addr: int = 1) -> DeviceId:
    return DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)


# ---------- EventBus ---------------------------------------------------


async def test_eventbus_sync_handler() -> None:
    bus: EventBus[int] = EventBus()
    hits: list[int] = []
    bus.subscribe(hits.append)
    await bus.publish(7)
    await bus.publish(42)
    assert hits == [7, 42]


async def test_eventbus_async_handler() -> None:
    bus: EventBus[int] = EventBus()
    hits: list[int] = []

    async def h(v: int) -> None:
        await asyncio.sleep(0)
        hits.append(v)

    bus.subscribe(h)
    await bus.publish(1)
    assert hits == [1]


async def test_eventbus_unsubscribe() -> None:
    bus: EventBus[int] = EventBus()
    hits: list[int] = []
    bus.subscribe(hits.append)
    bus.unsubscribe(hits.append)
    bus.unsubscribe(hits.append)        # second unsubscribe is a no-op
    await bus.publish(1)
    assert hits == []


async def test_eventbus_one_bad_handler_does_not_break_others() -> None:
    bus: EventBus[int] = EventBus()
    good: list[int] = []

    def bad(_v: int) -> None:
        raise RuntimeError("nope")

    async def bad_async(_v: int) -> None:
        raise RuntimeError("nope-async")

    bus.subscribe(bad)
    bus.subscribe(bad_async)
    bus.subscribe(good.append)
    await bus.publish(99)
    assert good == [99]


async def test_eventbus_subscriber_count() -> None:
    bus: EventBus[int] = EventBus()
    assert bus.subscriber_count == 0
    bus.subscribe(lambda _v: None)
    bus.subscribe(lambda _v: None)
    assert bus.subscriber_count == 2


# ---------- DeviceId.from_string --------------------------------------


def test_deviceid_from_string_roundtrip() -> None:
    d = _dev(42)
    assert DeviceId.from_string(str(d)) == d


def test_deviceid_from_string_bad_format() -> None:
    with pytest.raises(ValueError):
        DeviceId.from_string("SRM/1/2")               # too few parts
    with pytest.raises(ValueError):
        DeviceId.from_string("BOGUS/1/2/3")           # unknown DeviceType
    with pytest.raises(ValueError):
        DeviceId.from_string("SRM/abc/2/3")           # non-integer


# ---------- Replica ----------------------------------------------------


async def test_replica_records_relay_state() -> None:
    replica = Replica()
    msg = RelayState(device=_dev(5), state=True)
    await replica._on_relay_state(msg)  # noqa: SLF001
    snap = replica.get(_dev(5))
    assert snap is not None
    assert snap.relay_state is True
    assert snap.update_count == 1
    assert snap.last_seen is not None


async def test_replica_records_fail_report() -> None:
    replica = Replica()
    await replica._on_fail(  # noqa: SLF001
        FailReport(device=_dev(6), fail_code=0x99, detail=b"oops")
    )
    snap = replica.get(_dev(6))
    assert snap is not None
    assert snap.last_fail_code == 0x99
    assert snap.last_fail_detail == b"oops"


async def test_replica_publishes_events() -> None:
    replica = Replica()
    events: list[dict] = []
    replica.events.subscribe(events.append)

    await replica._on_relay_state(  # noqa: SLF001
        RelayState(device=_dev(1), state=False)
    )
    await replica._on_fail(  # noqa: SLF001
        FailReport(device=_dev(1), fail_code=1)
    )

    assert len(events) == 2
    assert events[0]["type"] == "relay_state"
    assert events[0]["device"] == "SRM/1/1/0"
    assert events[0]["state"] is False
    assert events[1]["type"] == "fail_report"
    assert events[1]["fail_code"] == 1


async def test_replica_all_lists_every_known_device() -> None:
    replica = Replica()
    for i in (1, 2, 3):
        await replica._on_relay_state(  # noqa: SLF001
            RelayState(device=_dev(i), state=True)
        )
    assert len({s.device for s in replica.all()}) == 3


async def test_snapshot_to_dict_serialisable() -> None:
    replica = Replica()
    await replica._on_relay_state(  # noqa: SLF001
        RelayState(device=_dev(1), state=True)
    )
    snap = replica.get(_dev(1))
    assert snap is not None
    d = snap.to_dict()
    assert d["device"] == "SRM/1/1/0"
    assert d["relay_state"] is True
    assert d["update_count"] == 1
    assert isinstance(d["last_seen"], str)


# ---------- attach() wires driver → replica ---------------------------


async def test_replica_attach_subscribes_to_driver(mock_scu_server) -> None:
    """End-to-end-ish: a driver event must flow into the replica when
    attached, without manual wiring."""
    from elc.transport import ScuLink

    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    await link.start()
    await link.wait_connected(timeout=2.0)
    try:
        driver = SrmDriver(link)
        replica = Replica()
        replica.attach(driver)

        # Synthesise a RelayState directly on the driver bus.
        await driver.on_state_change.publish(
            RelayState(device=_dev(99), state=True)
        )
        snap = replica.get(_dev(99))
        assert snap is not None
        assert snap.relay_state is True
    finally:
        await link.stop()

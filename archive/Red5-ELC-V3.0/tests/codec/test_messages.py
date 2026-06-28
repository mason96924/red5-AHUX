"""Unit tests for elc.codec.messages."""

from __future__ import annotations

from datetime import datetime, timezone

import pytest

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import (
    ALL_MESSAGES,
    DaliArcPower,
    DemandResponse,
    FailReport,
    Heartbeat,
    MessageError,
    PowerUp,
    RelaySet,
    RelayState,
    SceneRecall,
    StatusQuery,
    TimeDateSet,
)


def _dev() -> DeviceId:
    return DeviceId(dev_type=DeviceType.SRM, scu=2, address=10, sub_address=3)


# ---------- registry sanity -------------------------------------------


def test_each_message_has_unique_flag() -> None:
    flags = [m.FLAG for m in ALL_MESSAGES]
    assert len(set(flags)) == len(flags), flags


def test_all_messages_define_encode_decode() -> None:
    for m in ALL_MESSAGES:
        assert hasattr(m, "encode") and callable(m.encode)
        assert hasattr(m, "decode") and callable(m.decode)
        assert hasattr(m, "FLAG")


# ---------- TimeDateSet ------------------------------------------------


def test_timedateset_roundtrip() -> None:
    m = TimeDateSet(2026, 2, 14, 9, 30, 45, dow=4)
    assert TimeDateSet.decode(m.encode()) == m


def test_timedateset_from_datetime() -> None:
    dt = datetime(2026, 2, 14, 9, 30, 45, tzinfo=timezone.utc)
    m = TimeDateSet.from_datetime(dt)
    assert (m.year, m.month, m.day, m.hour, m.minute, m.second) == (
        2026, 2, 14, 9, 30, 45,
    )


def test_timedateset_naive_datetime_assumed_utc() -> None:
    dt = datetime(2026, 2, 14, 9, 30, 45)
    TimeDateSet.from_datetime(dt)  # must not raise on naive input


def test_timedateset_year_out_of_range() -> None:
    with pytest.raises(MessageError):
        TimeDateSet(1969, 1, 1, 0, 0, 0).encode()
    with pytest.raises(MessageError):
        TimeDateSet(2100, 1, 1, 0, 0, 0).encode()


def test_timedateset_bad_length() -> None:
    with pytest.raises(MessageError):
        TimeDateSet.decode(b"\x00" * 7)


# ---------- RelaySet / RelayState -------------------------------------


def test_relayset_roundtrip_on() -> None:
    m = RelaySet(device=_dev(), state=True)
    assert RelaySet.decode(m.encode()) == m
    assert m.encode()[-1] == 1


def test_relayset_roundtrip_off() -> None:
    m = RelaySet(device=_dev(), state=False)
    assert RelaySet.decode(m.encode()) == m
    assert m.encode()[-1] == 0


def test_relaystate_roundtrip() -> None:
    m = RelayState(device=_dev(), state=True)
    assert RelayState.decode(m.encode()) == m


def test_relayset_bad_length() -> None:
    with pytest.raises(MessageError):
        RelaySet.decode(b"\x00" * 4)


def test_relaystate_bad_length() -> None:
    with pytest.raises(MessageError):
        RelayState.decode(b"\x00" * 4)


# ---------- StatusQuery -----------------------------------------------


def test_statusquery_roundtrip() -> None:
    m = StatusQuery(device=_dev())
    assert StatusQuery.decode(m.encode()) == m


def test_statusquery_bad_length() -> None:
    with pytest.raises(MessageError):
        StatusQuery.decode(b"\x00\x00\x00")


# ---------- DemandResponse --------------------------------------------


def test_demand_response_roundtrip() -> None:
    m = DemandResponse(level=50, flags=0x80)
    assert DemandResponse.decode(m.encode()) == m


@pytest.mark.parametrize("level", [-1, 101, 200])
def test_demand_response_level_validated(level: int) -> None:
    with pytest.raises(MessageError):
        DemandResponse(level=level).encode()


def test_demand_response_flags_validated() -> None:
    with pytest.raises(MessageError):
        DemandResponse(level=0, flags=256).encode()


def test_demand_response_bad_length() -> None:
    with pytest.raises(MessageError):
        DemandResponse.decode(b"\x10")


# ---------- FailReport -------------------------------------------------


def test_failreport_roundtrip_no_detail() -> None:
    m = FailReport(device=_dev(), fail_code=0x42)
    assert FailReport.decode(m.encode()) == m


def test_failreport_roundtrip_with_detail() -> None:
    m = FailReport(device=_dev(), fail_code=0x42, detail=b"abc")
    assert FailReport.decode(m.encode()) == m


def test_failreport_detail_too_long() -> None:
    with pytest.raises(MessageError):
        FailReport(device=_dev(), fail_code=0, detail=b"x" * 36).encode()


def test_failreport_fail_code_validated() -> None:
    with pytest.raises(MessageError):
        FailReport(device=_dev(), fail_code=256).encode()


def test_failreport_bad_length() -> None:
    with pytest.raises(MessageError):
        FailReport.decode(b"\x00\x00\x00\x00")


# ---------- DaliArcPower -----------------------------------------------


def test_dali_arc_roundtrip() -> None:
    m = DaliArcPower(device=_dev(), arc=200, fade_time=4)
    assert DaliArcPower.decode(m.encode()) == m


def test_dali_arc_fade_time_validated() -> None:
    with pytest.raises(MessageError):
        DaliArcPower(device=_dev(), arc=0, fade_time=16).encode()


def test_dali_arc_value_validated() -> None:
    with pytest.raises(MessageError):
        DaliArcPower(device=_dev(), arc=256, fade_time=0).encode()


def test_dali_arc_bad_length() -> None:
    with pytest.raises(MessageError):
        DaliArcPower.decode(b"\x00" * 5)


# ---------- SceneRecall -----------------------------------------------


def test_scene_recall_roundtrip() -> None:
    m = SceneRecall(device=_dev(), scene_id=12)
    assert SceneRecall.decode(m.encode()) == m


def test_scene_recall_bad_length() -> None:
    with pytest.raises(MessageError):
        SceneRecall.decode(b"\x00" * 4)


def test_scene_recall_scene_id_validated() -> None:
    with pytest.raises(MessageError):
        SceneRecall(device=_dev(), scene_id=256).encode()


# ---------- PowerUp ----------------------------------------------------


def test_powerup_roundtrip_no_firmware() -> None:
    m = PowerUp(device=_dev())
    assert PowerUp.decode(m.encode()) == m


def test_powerup_roundtrip_with_firmware() -> None:
    m = PowerUp(device=_dev(), firmware=b"v1.2.3")
    assert PowerUp.decode(m.encode()) == m


def test_powerup_firmware_too_long() -> None:
    with pytest.raises(MessageError):
        PowerUp(device=_dev(), firmware=b"x" * 17).encode()


def test_powerup_bad_length() -> None:
    with pytest.raises(MessageError):
        PowerUp.decode(b"\x00\x00\x00")


# ---------- Heartbeat -------------------------------------------------


def test_heartbeat_roundtrip() -> None:
    m = Heartbeat(nonce=0xDEADBEEF)
    assert Heartbeat.decode(m.encode()) == m


def test_heartbeat_nonce_out_of_range() -> None:
    with pytest.raises(MessageError):
        Heartbeat(nonce=1 << 32).encode()


def test_heartbeat_bad_length() -> None:
    with pytest.raises(MessageError):
        Heartbeat.decode(b"\x00")

"""Stage A self-test for app.py.

Verifies that the admin/master key is loaded from the RED5_MASTER_KEY
environment variable (NOT hardcoded), and that the /api/config/unlock
endpoint accepts only the correct key.

How to run (see the chat for full step-by-step):
    pip install flask flask-cors
    python test_stage_a.py
"""
import os
import flask

TEST_KEY = "=2Zapo_kDt(kHJK^SNuQvseU"   # your new key
OLD_KEY = "b%9P$MdeQP]["                 # the old leaked key (must be rejected)

# Provision the key via the environment for this test, and stop app.py's
# real web server from starting -- we only want to test the logic.
os.environ["RED5_MASTER_KEY"] = TEST_KEY
flask.Flask.run = lambda *a, **k: None

import app  # noqa: E402

results = []


def check(name, condition):
    results.append(bool(condition))
    print(("  PASS  " if condition else "  FAIL  ") + name)


print("\nStage A self-test")
print("-----------------")

# 1) Key is loaded from the environment, not hardcoded.
check("key loaded from environment", app.MASTER_KEY_CONST == TEST_KEY)
check("old leaked key is NOT hardcoded anymore", app.MASTER_KEY_CONST != OLD_KEY)

# 2) The unlock endpoint accepts only the correct key.
client = app.app.test_client()


def unlock(pw):
    return client.post("/api/config/unlock", json={"password": pw}).get_json()


check("correct key unlocks", unlock(TEST_KEY) == {"ok": True})
check("old leaked key rejected", unlock(OLD_KEY) == {"ok": False})
check("empty password rejected", unlock("") == {"ok": False})

print("-----------------")
print(("ALL PASSED" if all(results) else "SOME FAILED") + f"  ({sum(results)}/{len(results)})")

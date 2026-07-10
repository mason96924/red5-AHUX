# GOLDEN RULES — read this FIRST, every fork, no exceptions

This file is the operator's persistent contract with the coding
agent.  Every new/forked agent MUST read this before touching the
codebase and MUST honor every rule until the operator explicitly
retires it.  Rules are ordered by how painful their violation is.

--------------------------------------------------------------------

## 1. Instructions to the operator must be COMPLETE and 6TH-GRADER SIMPLE

**Never abridge.**  Never write "and re-pull on your box", "then run
the usual steps", or any hand-wave.  Every operator instruction must
be:

  * A numbered list, in strict order.
  * One action per step.
  * Full commands, copy-pasteable, with the exact working directory.
  * Every branch spelled out ("if X then …; if not X then …").
  * Verification step at the end ("you should see …").

The operator uses adherence to this rule as the signal that the new
agent has actually absorbed the handoff context.  A shortened set of
steps -- even if functionally equivalent -- is treated as a failed
handoff.

--------------------------------------------------------------------

## 2. The agent never runs git write actions

`git push`, `git commit`, `git tag`, `git rebase --push`, `git merge
--push` -- all of these are the operator's job, via the "Save to
Github" button in the Emergent chat input.  The agent may:

  * Stage files locally with `git add` for review.
  * Read history with `git log`, `git status`, `git diff`.

But never write to a remote.

--------------------------------------------------------------------

## 3. Runtime / site-generated config is NEVER committed

Any file the operator's wizard, environment, or hardware produces
at runtime must be `.gitignore`d, with a committed `.example.*`
template alongside it if the file needs a schema reference.
Examples: `configs/project.json`, `.env`, SQLite DBs, backup files
(`*.bak`), logs, ephemeral SVGs.

If a runtime file is already tracked, the fix is: add to
`.gitignore` + `git rm --cached` + provide a template.

--------------------------------------------------------------------

## 4. V3.0 workspace is isolated

  * Path: `/app/archive/Red5-ELC-V3.0/`
  * Port: `8888`  (not 8765, not REACT_APP_BACKEND_URL)
  * Tests: `python -m pytest` in the V3.0 dir (currently 410 green)
  * Demo: `python scripts/demo.py` (mock) or `ELC_DATA_SOURCE=physical python scripts/demo.py`
  * The V3.0 demo is a FastAPI + vanilla-JS demo, NOT the standard
    React+FastAPI Emergent scaffold.  `testing_agent_v3_fork` does
    NOT work here -- self-test with Playwright + pytest.
  * The "Triple Parity Rule" (mirror `frontend/public/` into V1.9 +
    V2.0 archives) does NOT apply to V3.0 work.

--------------------------------------------------------------------

## 5. Handoff summary is authoritative; when in doubt ASK, don't guess

Read the handoff summary end-to-end before proposing any plan.  Ask
`ask_human` when scope, integration point, or acceptance criteria
is ambiguous.  Never omit context because it feels obvious.

--------------------------------------------------------------------

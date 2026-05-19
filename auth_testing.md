# Emergent Auth Integration Playbook (for testing agents)

Reference: returned by integration_playbook_expert_v2 on 2026-02-13.

## Setup quick-facts (this app)
- Backend: FastAPI at /app/backend/server.py.  Auth endpoints live under /api/auth/*.
- Frontend: React SPA at /app/frontend/.  Landing page is /, V1.9 dashboard is at /dashboard.html.
- MongoDB: local, db name `red5_v2_demo`.  Collections: `users`, `user_sessions`.
- Session: HTTP-only cookie `session_token` (path=/, secure=true, samesite=none).
- User ID pattern: custom `user_id = "user_" + uuid4().hex[:12]` (NOT MongoDB _id).
- Always project out `_id` with `{"_id": 0}` to keep API responses JSON-serializable.

## Test identity setup
```bash
mongosh --eval "
use('red5_v2_demo');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
"
```

## Verifying endpoints
```bash
SESSION="test_session_xxx"
curl -X GET "$URL/api/auth/me" -H "Authorization: Bearer $SESSION"
# Or via cookie:
curl -X GET "$URL/api/auth/me" -H "Cookie: session_token=$SESSION"
```

## Browser testing
```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_TOKEN",
    "domain": "controller-dashboard-2.preview.emergentagent.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None",
}])
```

## Notes
- The public demo path at /dashboard.html stays open without auth (Phase 2 Piece A).
- Per-tenant data isolation lands in Phase 2 Piece B (later).
- No Google API keys are needed: Emergent manages OAuth.

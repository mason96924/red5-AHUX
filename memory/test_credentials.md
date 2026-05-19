# Test Credentials

## V2.0 Phase 2c (Admin Allowlist)

**Admin roster**: `ADMIN_EMAILS` in `/app/backend/.env` (comma-separated).
Current admins:
- `seeker0829@gmail.com`

Admin status surfaces as `is_admin: true` on `GET /api/auth/me` and renders the
**ACCESS CONTROL** button in the V2.0 landing header.  Admin-gated endpoints:

| Method | Path                                | Notes                     |
|--------|-------------------------------------|---------------------------|
| GET    | `/api/auth/allowlist`               | List entries + open=true/false |
| POST   | `/api/auth/allowlist`               | `{type: domain|email, value}` |
| DELETE | `/api/auth/allowlist/{id}`          | Remove entry              |

Admin emails always bypass the allowlist so a typo can never lock you out.

## V2.0 Phase 2a (Emergent Google Auth)

**Auth provider**: Emergent-managed Google OAuth.  No app-managed passwords.

**How testing agents should seed a logged-in identity**:

```bash
mongosh --quiet --eval "
use('red5_v2_demo');
var userId = 'user_' + Math.floor(Math.random() * 1e12).toString(16);
var token  = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'tester+' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://i.pravatar.cc/64?u=' + userId,
  created_at: new Date(),
  last_login_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: token,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('TOKEN=' + token);
print('USER=' + userId);
"
```

**Verifying via curl**:
```bash
curl -X GET https://controller-dashboard-2.preview.emergentagent.com/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Verifying via Playwright (browser)**:
```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "$TOKEN",
    "domain": "controller-dashboard-2.preview.emergentagent.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None",
}])
```

**MongoDB connection**:
- URL : `mongodb://localhost:27017`  (env: `MONGO_URL`)
- DB  : `red5_v2_demo`  (env: `DB_NAME`)
- Collections: `users`, `user_sessions`

**Test playbook**: See `/app/auth_testing.md` for the full agent playbook.

## V1.9 Controller (unchanged, for context)
- Master encryption password: `b%9P$MdeQP][` (only used for `/api/repair/upload-plugin` flow on the controller).  Not relevant for V2.0 web demo.

## Allowlist
- No domain allowlist in Phase 2a.  Any Google identity can sign in (anonymous demo path also remains open).
- Domain allowlisting + per-tenant isolation lands in Phase 2 Piece B.

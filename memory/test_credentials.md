# Test Credentials

## Equipment Configuration Tool
- Master Password Bypass: `b%9P$MdeQP][`

## Landing Page
- Master Key: `b%9P$MdeQP][`
- Skip button available (goes directly to dashboard)

## Bundle Encryption
- Master Encryption Password: `b%9P$MdeQP][`
- Same key works for `/api/upload-bundle-chunk` encrypted payloads.

## Repair Mode
- No separate password — gated by the master key on `/update`.
- Hot-reload endpoint: `POST /api/repair/reload-module/<name>` (handles fresh imports).
- Plugin upload endpoint: `POST /api/repair/upload-plugin` (rejects mismatched filenames).

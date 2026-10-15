# Voxel Vandal Smart QR redirect service

Phase 2 of the Smart QR product. This Cloudflare Worker resolves permanent,
non-sequential QR tokens through D1 and issues temporary redirects to
customer-controlled HTTPS destinations.

## Public behavior

- `GET /{token}` — resolve a Smart QR
- `GET /health` — verify the Worker and D1 binding
- `GET /` — branded service information page

Active units return HTTP `302`, not `301`, because their destinations are
programmable. Redirect responses use `Cache-Control: no-store`, so a destination
change is visible immediately.

Paused, draft, retired, missing, malformed, and misconfigured units receive
controlled branded pages rather than uncontrolled errors.

## Local development

```shell
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Test the seeded active unit:

```shell
curl -I http://localhost:8787/TEST7mP4x9Q2
```

The expected response is `302` with:

```text
Location: https://voxelvandal.com/smart-qr/
Cache-Control: no-store
```

## Verification

```shell
npm run typecheck
npm test
npm run build
```

## Production deployment

Production infrastructure created on July 24, 2026:

- Worker: `voxel-vandal-smart-qr-redirect`
- D1 database: `smart-qr-db`
- Custom domain: `https://q.voxelvandal.com`
- Workers.dev fallback:
  `https://voxel-vandal-smart-qr-redirect.agentbrook.workers.dev`

The production database intentionally starts without seeded test records. Insert
the first physical unit only after confirming the exact case-sensitive token
encoded in its printed QR.

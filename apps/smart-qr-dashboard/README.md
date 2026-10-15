# Voxel Vandal Smart QR dashboard

Private admin application for customer accounts, persistent Smart QR units, and
manufacturing files.

## Current workflow

1. Select or create a customer account.
2. Click **Add Smart QR**.
3. Enter a display name, optional HTTPS destination, and insert size.
4. The API reserves one immutable unit number and public token.
5. The browser generates SVG, preview PNG, combined STL, production notes, and a
   ZIP package.
6. The API stores the files in private R2 and their metadata in D1.
7. The saved unit appears in the customer's list. Editing the destination never
   changes the permanent printed URL.

Page loads and refreshes are read-only. They never allocate unit numbers or
tokens. Regenerating manufacturing files creates a new asset version for the
same unit.

## Local development

```text
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Open `http://localhost:5174`.

The API is intentionally locked to `localhost` and `127.0.0.1` while
`DASHBOARD_MODE` is `local-only`.

## Production prerequisites

- Enable Cloudflare R2 and create the private
  `smart-qr-manufacturing-assets` Standard storage bucket.
- Protect the dashboard with authenticated admin access.
- Replace the local-only API guard with verified authentication before any
  public deployment.
- Keep manufacturing asset downloads admin-only.

Do not deploy the current dashboard publicly. Its Worker refuses dashboard API
requests on public hostnames as a fail-safe.

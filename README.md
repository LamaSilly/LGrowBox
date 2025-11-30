# LGrowBox

A lightweight dashboard for monitoring and configuring your grow box. Login is required to save configuration changes, and device updates must use a secret API key.

## Running locally

Set environment variables before running your Next.js or Vercel dev server:

- `TOKEN_SECRET`: secret used to sign login tokens.
- `DEVICE_API_KEY` (optional): API key that the device uses when posting sensor updates to `/api/update`. Defaults to `growbox2025` when unset.

Serve the project with your preferred tool (for example `npm run dev` in a Next.js app) and open `http://localhost:3000` to access the dashboard.

## Telemetry endpoints for Vercel

- `POST /api/update` writes the latest telemetry to `/tmp/latest.json`. Provide a JSON payload with `apikey` (matching `DEVICE_API_KEY` or the default `growbox2025`) and your sensor values. A timestamp is added automatically.
- `GET /api/latest` returns the last saved payload or `{ "error": "No data yet" }` if nothing has been posted.

Example device payload sent every 30 seconds:

```json
{
  "apikey": "growbox2025",
  "temp": 24.5,
  "humidity": 58,
  "soil": 410
}
```

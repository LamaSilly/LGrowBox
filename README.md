# LGrowBox

A lightweight dashboard for monitoring and configuring your grow box. Login is required to save configuration changes, and device updates must use a secret API key.

## Running locally

Set environment variables before running your Next.js or Vercel dev server:

- `TOKEN_SECRET`: secret used to sign login tokens.
- `DEVICE_API_KEY`: API key that the device uses when posting sensor updates to `/api/update`.

Serve the project with your preferred tool (for example `npm run dev` in a Next.js app) and open `http://localhost:3000` to access the dashboard.

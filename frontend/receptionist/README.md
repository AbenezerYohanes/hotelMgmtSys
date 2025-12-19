# Receptionist Frontend

Next.js frontend for Receptionist role. Uses JWT to communicate with receptionist backend.

Setup

1. Copy `.env.local.example` to `.env.local` and update `NEXT_PUBLIC_API_URL`.
2. Install deps: `npm install`.
3. Run: `npm run dev` (port 3030 by default in existing package.json).

Pages

- `/login` — login page
- `/dashboard` — main dashboard (protected)
- `/bookings`, `/checkin`, `/checkout`, `/guests`, `/rooms`, `/payments`, `/walkin`, `/notifications`, `/profile`

Auth

- Stores JWT in `localStorage` and includes it in `Authorization` header.
- Auto-logout on token expiry (basic).

# Staff React App (skeleton)

This is a minimal skeleton for the staff SPA. Use CRA or your preferred setup to expand.

Install and run (example using CRA):

```
cd frontend/staff
# npx create-react-app .  (or use your toolchain)
```
# Staff Module - Frontend (Next.js)

This is the staff-facing Next.js app. It communicates with the Staff Backend API.

Setup

1. Install dependencies:

```bash
cd frontend/staff
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Login at `/login` using the seeded staff user `staff@example.com` / `password123`.

Notes
- App runs on port 3001 by default. Change as needed.
- Set `NEXT_PUBLIC_STAFF_API` env var to point to the staff backend (default: http://localhost:4001/staff).

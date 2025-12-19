# Receptionist Backend

Minimal, production-minded Express.js backend module for Receptionist role.

Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`.
3. Run DB and configure credentials.
4. Seed data: `npm run seed`.
5. Start: `npm run dev` or `npm start`.

APIs

- `POST /api/receptionist/auth/login` — receptionist login
- `GET /api/receptionist/bookings` — bookings list (protected)
- `POST /api/receptionist/checkin` — check-in (protected)
- `POST /api/receptionist/checkout` — check-out (protected)

Security

- JWT auth
- Role guard (receptionist only)
- Rate limiting
- Input validation (basic)

This module is isolated — do not mix with other roles.

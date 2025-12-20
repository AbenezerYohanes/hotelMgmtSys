# HR Module — Overview

This repository addition implements a centralized HR module for Superadmin and Admin roles.

Structure

- Backend HR code: `backend/superadmin/hr` and `backend/admin/hr`.
- Frontend HR UI: `frontend/superadmin/hr` and `frontend/admin/hr` (Next.js pages live under `pages/hr`).

Quick start

1. Backend: from `backend` run `npm install` then set env vars (`DATABASE_URL` or DB config) and `node server.js`.
2. Frontend: in `frontend/superadmin` run `npm install` then `npm run dev`. Set `NEXT_PUBLIC_API_URL` to backend API base (e.g., `http://localhost:4000/api`).

Seed data

- Set `SEED_SAMPLE_DATA=true` in backend env and restart server to create initial superadmin/admin users, roles, departments and shifts.

Security & Auth

- JWT authentication and role-based guards are enforced via `backend/middleware/auth.js`.
- Passwords are hashed with `bcrypt` by `User` model hooks.
- Rate limiting and helmet are enabled in `backend/middleware/security.js`.

DB Schema (high level)

- `employees` (links to `Users`) — stores employment info
- `roles`, `departments`, `shifts`, `attendance`, `leave_requests`, `payroll`, `payroll_items`, `performance_reviews`, `hr_policies`

Permissions

- `superadmin` - global HR: manage admins, policies, payroll rules and system analytics.
- `admin` - hotel-level HR: manage employees, schedules, attendance, leave, payroll records.
- `staff`/`receptionist` - read-only access to own profile, schedule, attendance, leave status and payslips.

Files added

- Backend models: `backend/superadmin/hr/models/*`
- Backend services/controllers/routes: `backend/superadmin/hr/*`, `backend/admin/hr/*`
- Frontend components/pages: `frontend/superadmin/hr/*`, `frontend/admin/hr/*`

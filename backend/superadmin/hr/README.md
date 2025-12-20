# HR Module (Backend)

Overview

- Centralized HR module for Superadmin and Admin scopes.

Setup

- Ensure `DATABASE_URL` or DB config is set in `backend/config/database.js`.
- Install dependencies: `npm install` in `backend`.
- Run server: `node server.js` (or via Docker compose).
- To seed HR data set `SEED_SAMPLE_DATA=true` and restart.

API (examples)

- Superadmin endpoints (require `superadmin` role):

  - `GET /api/superadmin/hr/employees`
  - `POST /api/superadmin/hr/employees`
  - `GET /api/superadmin/hr/departments`

- Admin endpoints (require `admin` or `superadmin`):
  - `GET /api/admin/hr/employees`
  - `GET /api/admin/hr/departments`

Models (MySQL/Sequelize): employees, roles, departments, shifts, attendance, leave_requests, payroll, payroll_items, performance_reviews, hr_policies

Security

- JWT auth, role-based guards, bcrypt for passwords, rate limiting and helmet are enabled in `backend/server.js`.

# Heaven Hotel Management System

Heaven is a Laravel-based hotel management MVP with role-based modules for guests,
front desk operations, housekeeping, maintenance, HR, and admin reporting.

## Requirements
- PHP 8.2+
- Composer 2+
- Node.js 18+ (with npm)
- MySQL 8+

## Setup
1. Install PHP dependencies:
   ```bash
   composer install
   ```
2. Copy the environment file and configure the database:
   ```bash
   copy .env.example .env
   ```
3. Update `.env` with your database credentials and app URL.
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Install frontend dependencies and build assets:
   ```bash
   npm install
   npm run build
   ```
6. Run migrations and seed demo data:
   ```bash
   php artisan migrate --seed
   ```
7. Start the server:
   ```bash
   php artisan serve
   ```

For development with live asset rebuilds, use:
```bash
npm run dev
```

## Environment Configuration
Key settings in `.env`:
- `APP_URL` - base URL for the app (e.g., `http://127.0.0.1:8000`)
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `IHMS_TAX_RATE` - invoice tax rate (decimal, e.g., `0.075`)

## Commands
```bash
php artisan migrate --seed
```
```bash
php artisan db:seed
```

## Demo Accounts
All demo users use the password `Password@123`.

| Role        | Email               |
|-------------|---------------------|
| Admin       | admin@ihms.local     |
| FrontDesk   | frontdesk@ihms.local |
| Housekeeper | housekeeper@ihms.local |
| HRManager   | hr@ihms.local        |
| Guest       | guest@ihms.local     |
| Guest       | guest2@ihms.local    |
| Guest       | guest3@ihms.local    |

## Features
- Authentication scaffolding with Bootstrap 5 UI.
- Role-based access control via spatie/laravel-permission.
- Admin: room types and rooms CRUD, reports, audit log viewer.
- Guest: availability search, booking, cancel flow, and my bookings.
- Front Desk: room matrix, calendar view, walk-in booking, check-in/out, invoices.
- Housekeeping: assigned rooms and clean/dirty status updates.
- Maintenance: issue reporting and resolution workflow.
- HR: employee directory, shift scheduling, attendance tracking.
- Audit logs for key actions across modules.

## Screenshots (Placeholders)
- `docs/screenshots/login.png`
- `docs/screenshots/guest-dashboard.png`
- `docs/screenshots/frontdesk-dashboard.png`
- `docs/screenshots/housekeeping-dashboard.png`
- `docs/screenshots/hr-dashboard.png`
- `docs/screenshots/admin-reports.png`

## Project Structure
- `app/Http/Controllers` - request handling for each module.
- `app/Models` - Eloquent models and relationships.
- `resources/views` - Blade templates with Bootstrap layout.
- `routes/web.php` - route definitions and role middleware.
- `database/migrations` - schema for Heaven MVP tables.
- `database/seeders` - demo and role seeding.
- `config/ihms.php` - app configuration (tax rate).

## Notes
- Demo bookings are anchored to a fixed seed date (`2025-12-15`) for deterministic data.
  Update `database/seeders/DemoDataSeeder.php` if you want dates closer to today.

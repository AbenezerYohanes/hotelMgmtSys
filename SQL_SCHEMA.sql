-- SQL schema for hotelMgmtSys (derived from server/database/schema.sql)

USE hotel_management;

-- (The file contains table definitions for users, hotels, rooms, bookings, employees,
-- payments, room_types, departments, attendance, payroll, guests, audit_logs,
-- admin_privileges, staff_documents, invoices, plus sample inserts.)

-- For the full schema, apply `server/database/schema.sql` which contains the authoritative schema.
-- To apply this schema (mysql client):
-- 1. Backup existing DB: `mysqldump -u <user> -p <database> > backup_before_schema.sql`
-- 2. Apply schema: `mysql -u <user> -p <database> < server/database/schema.sql`

-- NOTE: This file is a short pointer; use `server/database/schema.sql` for the full SQL.

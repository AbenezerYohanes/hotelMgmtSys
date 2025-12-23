-- Complete Schema for Hotel + HR Management System (PostgreSQL/Render)
-- Multi-role support: SuperAdmin, Admin, Staff, Receptionist, Guest

CREATE DATABASE IF NOT EXISTS hotel_hr_management;
\c hotel_hr_management;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS employee_documents CASCADE;
DROP TABLE IF EXISTS performance_reviews CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS billing CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

-- Hotels
CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  contact VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  hotel_id INTEGER REFERENCES hotels(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER REFERENCES hotels(id) ON DELETE SET NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  contact VARCHAR(50),
  address TEXT,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  working_year INTEGER DEFAULT 0,
  total_working_year INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shifts
CREATE TABLE shifts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIMESTAMP,
  clock_out TIMESTAMP,
  status VARCHAR(20) DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date)
);

-- Leave Requests
CREATE TABLE leave_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type VARCHAR(20) DEFAULT 'personal' CHECK (type IN ('sick', 'vacation', 'personal', 'other')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll
CREATE TABLE payroll (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  salary DECIMAL(10, 2) DEFAULT 0.00,
  allowances DECIMAL(10, 2) DEFAULT 0.00,
  deductions DECIMAL(10, 2) DEFAULT 0.00,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Reviews
CREATE TABLE performance_reviews (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
  comments TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Documents
CREATE TABLE employee_documents (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  document_path VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guests
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  contact VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER REFERENCES hotels(id) ON DELETE SET NULL,
  room_type VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  capacity INTEGER DEFAULT 1,
  amenities JSONB,
  price DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out')),
  total_price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing
CREATE TABLE billing (
  id SERIAL PRIMARY KEY,
  reservation_id INTEGER REFERENCES reservations(id) ON DELETE SET NULL,
  guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'cash', 'chapa')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
-- Insert Roles
INSERT INTO roles (name, permissions) VALUES
('superadmin', '{"all": true}'),
('admin', '{"hr": true, "hotel": true, "reports": true}'),
('staff', '{"view_own": true}'),
('receptionist', '{"bookings": true, "guests": true, "view_own": true}'),
('guest', '{"bookings": true, "profile": true}');

-- Insert Default Hotel
INSERT INTO hotels (name, location, contact, email) VALUES
('Grand Hotel', '123 Main Street, City, Country', '+1234567890', 'info@grandhotel.com');

-- Insert Default SuperAdmin (password: admin123)
INSERT INTO employees (hotel_id, first_name, last_name, email, password, role_id, status) VALUES
(1, 'Super', 'Admin', 'superadmin@hotel.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 1, 'active');

-- Insert Sample Departments
INSERT INTO departments (name, hotel_id) VALUES
('Front Desk', 1),
('Housekeeping', 1),
('Maintenance', 1),
('Food & Beverage', 1),
('Management', 1);

-- Insert Sample Shifts
INSERT INTO shifts (name, start_time, end_time) VALUES
('Morning', '08:00:00', '16:00:00'),
('Evening', '16:00:00', '00:00:00'),
('Night', '00:00:00', '08:00:00');

-- Insert Sample Rooms
INSERT INTO rooms (hotel_id, room_type, location, capacity, amenities, price, status) VALUES
(1, 'Single', 'Floor 1', 1, '["WiFi", "TV", "AC"]', 50.00, 'available'),
(1, 'Double', 'Floor 1', 2, '["WiFi", "TV", "AC", "Mini Bar"]', 80.00, 'available'),
(1, 'Suite', 'Floor 2', 4, '["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi"]', 150.00, 'available');

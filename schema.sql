-- Complete Schema for Hotel + HR Management System (MySQL/XAMPP)
-- Multi-role support: SuperAdmin, Admin, Staff, Receptionist, Guest

CREATE DATABASE IF NOT EXISTS `hotel_hr_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_hr_management`;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables
DROP TABLE IF EXISTS `employee_documents`;
DROP TABLE IF EXISTS `performance_reviews`;
DROP TABLE IF EXISTS `payroll`;
DROP TABLE IF EXISTS `leave_requests`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `shifts`;
DROP TABLE IF EXISTS `billing`;
DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `rooms`;
DROP TABLE IF EXISTS `guests`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `hotels`;

-- Hotels
CREATE TABLE `hotels` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `contact` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Roles
CREATE TABLE `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `permissions` JSON DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Departments
CREATE TABLE `departments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_departments_hotel` (`hotel_id`),
  CONSTRAINT `fk_departments_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employees
CREATE TABLE `employees` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `department_id` INT UNSIGNED DEFAULT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `contact` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  `working_year` INT DEFAULT 0,
  `total_working_year` INT DEFAULT 0,
  `status` ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
  `picture` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employees_hotel` (`hotel_id`),
  KEY `idx_employees_role` (`role_id`),
  KEY `idx_employees_department` (`department_id`),
  CONSTRAINT `fk_employees_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_employees_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_employees_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Shifts
CREATE TABLE `shifts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Attendance
CREATE TABLE `attendance` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `clock_in` DATETIME DEFAULT NULL,
  `clock_out` DATETIME DEFAULT NULL,
  `status` ENUM('present', 'absent', 'late', 'on_leave') DEFAULT 'absent',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_attendance_employee_date` (`employee_id`, `date`),
  KEY `idx_attendance_employee` (`employee_id`),
  CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leave Requests
CREATE TABLE `leave_requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `type` ENUM('sick', 'vacation', 'personal', 'other') DEFAULT 'personal',
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `reason` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leave_employee` (`employee_id`),
  CONSTRAINT `fk_leave_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payroll
CREATE TABLE `payroll` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `salary` DECIMAL(10, 2) DEFAULT 0.00,
  `allowances` DECIMAL(10, 2) DEFAULT 0.00,
  `deductions` DECIMAL(10, 2) DEFAULT 0.00,
  `date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payroll_employee` (`employee_id`),
  CONSTRAINT `fk_payroll_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Performance Reviews
CREATE TABLE `performance_reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `reviewer_id` INT UNSIGNED DEFAULT NULL,
  `rating` INT DEFAULT 0 CHECK (`rating` >= 0 AND `rating` <= 10),
  `comments` TEXT DEFAULT NULL,
  `date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_employee` (`employee_id`),
  KEY `idx_reviews_reviewer` (`reviewer_id`),
  CONSTRAINT `fk_reviews_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employee Documents
CREATE TABLE `employee_documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `document_path` VARCHAR(500) NOT NULL,
  `status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_documents_employee` (`employee_id`),
  CONSTRAINT `fk_documents_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Guests
CREATE TABLE `guests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `contact` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Rooms
CREATE TABLE `rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `room_type` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `capacity` INT DEFAULT 1,
  `amenities` JSON DEFAULT NULL,
  `price` DECIMAL(10, 2) DEFAULT 0.00,
  `status` ENUM('available', 'occupied', 'maintenance', 'cleaning') DEFAULT 'available',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rooms_hotel` (`hotel_id`),
  CONSTRAINT `fk_rooms_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reservations
CREATE TABLE `reservations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `guest_id` INT UNSIGNED NOT NULL,
  `room_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out') DEFAULT 'pending',
  `total_price` DECIMAL(10, 2) DEFAULT 0.00,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reservations_guest` (`guest_id`),
  KEY `idx_reservations_room` (`room_id`),
  CONSTRAINT `fk_reservations_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reservations_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Billing
CREATE TABLE `billing` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reservation_id` INT UNSIGNED DEFAULT NULL,
  `guest_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('credit_card', 'debit_card', 'paypal', 'cash', 'chapa') DEFAULT 'cash',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_billing_reservation` (`reservation_id`),
  KEY `idx_billing_guest` (`guest_id`),
  CONSTRAINT `fk_billing_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_billing_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed Data
-- Insert Roles
INSERT INTO `roles` (`name`, `permissions`) VALUES
('superadmin', '{"all": true}'),
('admin', '{"hr": true, "hotel": true, "reports": true}'),
('staff', '{"view_own": true}'),
('receptionist', '{"bookings": true, "guests": true, "view_own": true}'),
('guest', '{"bookings": true, "profile": true}');

-- Insert Default Hotel
INSERT INTO `hotels` (`name`, `location`, `contact`, `email`) VALUES
('Grand Hotel', '123 Main Street, City, Country', '+1234567890', 'info@grandhotel.com');

-- Insert Default SuperAdmin (password: admin123)
INSERT INTO `employees` (`hotel_id`, `first_name`, `last_name`, `email`, `password`, `role_id`, `status`) VALUES
(1, 'Super', 'Admin', 'superadmin@hotel.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 1, 'active');

-- Insert Sample Departments
INSERT INTO `departments` (`name`, `hotel_id`) VALUES
('Front Desk', 1),
('Housekeeping', 1),
('Maintenance', 1),
('Food & Beverage', 1),
('Management', 1);

-- Insert Sample Shifts
INSERT INTO `shifts` (`name`, `start_time`, `end_time`) VALUES
('Morning', '08:00:00', '16:00:00'),
('Evening', '16:00:00', '00:00:00'),
('Night', '00:00:00', '08:00:00');

-- Insert Sample Rooms
INSERT INTO `rooms` (`hotel_id`, `room_type`, `location`, `capacity`, `amenities`, `price`, `status`) VALUES
(1, 'Single', 'Floor 1', 1, '["WiFi", "TV", "AC"]', 50.00, 'available'),
(1, 'Double', 'Floor 1', 2, '["WiFi", "TV", "AC", "Mini Bar"]', 80.00, 'available'),
(1, 'Suite', 'Floor 2', 4, '["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi"]', 150.00, 'available');

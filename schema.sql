-- Full Schema for Hotel Management System (MySQL)
-- Generated from Sequelize models in server/models

CREATE DATABASE IF NOT EXISTS `hotel_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_management`;

-- Drop existing tables to ensure schema can be applied cleanly
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `guests`;
DROP TABLE IF EXISTS `rooms`;
DROP TABLE IF EXISTS `room_types`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `hotels`;
DROP TABLE IF EXISTS `users`;
-- Keep FOREIGN_KEY_CHECKS disabled while creating tables and adding constraints

-- Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(150) DEFAULT NULL,
  `last_name` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `address` TEXT,
  `role` ENUM('super_admin','admin','manager','staff','client') DEFAULT 'client',
  `is_active` TINYINT(1) DEFAULT 1,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_users_email` (`email`),
  UNIQUE KEY `ux_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hotels
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `country` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `created_by` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hotels_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Departments
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `manager_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_departments_manager` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employees
CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `employee_id` VARCHAR(100) NOT NULL,
  `department_id` INT UNSIGNED DEFAULT NULL,
  `position` VARCHAR(150) DEFAULT NULL,
  `hire_date` DATE DEFAULT NULL,
  `salary` DECIMAL(10,2) DEFAULT 0.00,
  `emergency_contact` VARCHAR(255) DEFAULT NULL,
  `emergency_phone` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('active','inactive','terminated') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_employees_employee_id` (`employee_id`),
  KEY `idx_employees_user` (`user_id`),
  KEY `idx_employees_department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Room types
CREATE TABLE IF NOT EXISTS `room_types` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `base_price` DECIMAL(10,2) DEFAULT 0.00,
  `capacity` INT DEFAULT 1,
  `amenities` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Rooms
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `room_number` VARCHAR(50) NOT NULL,
  `floor` INT DEFAULT NULL,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `room_type_id` INT UNSIGNED DEFAULT NULL,
  `status` ENUM('available','occupied','maintenance','cleaning') DEFAULT 'available',
  `is_clean` TINYINT(1) DEFAULT 1,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `amenities` TEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_rooms_room_number` (`room_number`),
  KEY `idx_rooms_hotel` (`hotel_id`),
  KEY `idx_rooms_room_type` (`room_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Guests
CREATE TABLE IF NOT EXISTS `guests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `id_type` VARCHAR(100) DEFAULT NULL,
  `id_number` VARCHAR(255) DEFAULT NULL,
  `nationality` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ux_guests_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_number` VARCHAR(100) NOT NULL,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `room_id` INT UNSIGNED DEFAULT NULL,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `guest_id` INT UNSIGNED DEFAULT NULL,
  `check_in_date` DATETIME NOT NULL,
  `check_out_date` DATETIME NOT NULL,
  `adults` INT DEFAULT 1,
  `children` INT DEFAULT 0,
  `nights` INT DEFAULT NULL,
  `total_amount` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('pending','confirmed','cancelled','checked_in','checked_out') DEFAULT 'pending',
  `special_requests` TEXT DEFAULT NULL,
  `stripe_payment_intent` VARCHAR(255) DEFAULT NULL,
  `payment_status` ENUM('pending','succeeded','refunded') DEFAULT 'pending',
  `receipt_url` VARCHAR(1024) DEFAULT NULL,
  `created_by` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_bookings_number` (`booking_number`),
  KEY `idx_bookings_room` (`room_id`),
  KEY `idx_bookings_guest` (`guest_id`),
  KEY `idx_bookings_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `payment_method` VARCHAR(100) DEFAULT NULL,
  `payment_status` VARCHAR(50) DEFAULT 'pending',
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_booking` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample seed data
INSERT INTO `users` (`username`, `email`, `password`, `first_name`, `last_name`, `role`) VALUES
('superadmin','superadmin@example.com','$2a$10$ExampleHashedPassword','Super','Admin','super_admin');

INSERT INTO `hotels` (`name`,`description`,`country`,`city`,`address`,`created_by`) VALUES
('Demo Hotel','Sample hotel used for local development','USA','Demo City','123 Demo Street',1);

INSERT INTO `room_types` (`name`,`description`,`base_price`,`capacity`) VALUES
('Single','Single bed',50.00,1),
('Double','Double bed',80.00,2),
('Suite','Suite room',150.00,4);

INSERT INTO `rooms` (`room_number`,`floor`,`hotel_id`,`room_type_id`,`status`,`price`) VALUES
('101',1,1,1,'available',50.00),
('102',1,1,2,'available',80.00),
('201',2,1,3,'available',150.00);

INSERT INTO `guests` (`first_name`,`last_name`,`email`,`phone`) VALUES
('John','Doe','john.doe@example.com','+15551234567');

INSERT INTO `bookings` (`booking_number`,`hotel_id`,`room_id`,`guest_id`,`check_in_date`,`check_out_date`,`adults`,`children`,`nights`,`total_amount`,`status`,`created_by`) VALUES
('BK_SAMPLE_1',1,1,1,DATE_ADD(CURDATE(), INTERVAL 1 DAY),DATE_ADD(CURDATE(), INTERVAL 3 DAY),2,0,2,100.00,'pending',1);

INSERT INTO `payments` (`booking_id`,`amount`,`currency`,`payment_method`,`payment_status`,`transaction_id`) VALUES
(1,100.00,'USD','Stripe','pending','txn_sample_1');

-- Add foreign key constraints after all tables are created
-- Foreign key constraints have been extracted to `schema-fks.sql`.
-- If you want to apply constraints after creating tables, run:
--   mysql -u <user> -p < server/db/schema-fks.sql
-- or use the node script: `node scripts/apply-fks.js` (not created by default).

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


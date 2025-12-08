-- Schema for Hotel Management System (MySQL)
-- Run this to create the core tables shown below.

CREATE DATABASE IF NOT EXISTS `hotel_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_management`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(150),
  `last_name` VARCHAR(150),
  `phone` VARCHAR(50),
  `address` TEXT,
  `role` ENUM('super_admin','admin','manager','staff','client') DEFAULT 'client',
  `is_active` BOOLEAN DEFAULT TRUE,
  `hotel_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
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

-- Rooms (example)
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `room_number` VARCHAR(50) NOT NULL,
  `room_type_id` INT UNSIGNED DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'available',
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `amenities` TEXT DEFAULT NULL,
  `created_by` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample seed data
INSERT INTO `users` (`username`, `email`, `password`, `first_name`, `last_name`, `role`)
VALUES
('superadmin', 'superadmin@example.com', '$2a$10$ExampleHashedPassword', 'Super', 'Admin', 'super_admin');

INSERT INTO `room_types` (`name`, `description`, `base_price`, `capacity`)
VALUES
('Single', 'Single bed room', 50.00, 1),
('Double', 'Double bed room', 80.00, 2);

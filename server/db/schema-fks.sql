-- Foreign key constraints for Hotel Management schema
-- These were extracted from schema.sql so the main schema can be applied
-- Run this file after verifying tables and column types are correct

ALTER TABLE `hotels` ADD CONSTRAINT `fk_hotels_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `departments` ADD CONSTRAINT `fk_departments_manager` FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `employees` ADD CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `employees` ADD CONSTRAINT `fk_employees_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `rooms` ADD CONSTRAINT `fk_rooms_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `rooms` ADD CONSTRAINT `fk_rooms_room_type` FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `bookings` ADD CONSTRAINT `fk_bookings_room` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `bookings` ADD CONSTRAINT `fk_bookings_guest` FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `bookings` ADD CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `bookings` ADD CONSTRAINT `fk_bookings_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Re-enable foreign key checks after applying constraints
SET FOREIGN_KEY_CHECKS = 1;

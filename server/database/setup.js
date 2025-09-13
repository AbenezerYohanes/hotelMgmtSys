const { query } = require('./config');

const createTables = async () => {
  try {
    console.log('🗄️ Setting up database tables...');

    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        phone VARCHAR(20),
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Departments table
    await query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        manager_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES users(id)
      )
    `);

    // Employees table (HR Management)
    await query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        department_id INT,
        position VARCHAR(100) NOT NULL,
        hire_date DATE NOT NULL,
        salary DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'active',
        emergency_contact VARCHAR(100),
        emergency_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);

    // Room types table
    await query(`
      CREATE TABLE IF NOT EXISTS room_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        capacity INT NOT NULL,
        amenities JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Rooms table
    await query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_number VARCHAR(10) UNIQUE NOT NULL,
        room_type_id INT,
        floor INT NOT NULL,
        status VARCHAR(20) DEFAULT 'available',
        is_clean BOOLEAN DEFAULT true,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (room_type_id) REFERENCES room_types(id)
      )
    `);

    // Guests table
    await query(`
      CREATE TABLE IF NOT EXISTS guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        id_type VARCHAR(20),
        id_number VARCHAR(50),
        nationality VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_number VARCHAR(20) UNIQUE NOT NULL,
        guest_id INT,
        room_id INT,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        adults INT DEFAULT 1,
        children INT DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        special_requests TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests(id),
        FOREIGN KEY (room_id) REFERENCES rooms(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Payments table
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(100),
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);

    // Maintenance table
    await query(`
      CREATE TABLE IF NOT EXISTS maintenance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT,
        issue_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'open',
        assigned_to INT,
        reported_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL,
        notes TEXT,
        FOREIGN KEY (room_id) REFERENCES rooms(id),
        FOREIGN KEY (assigned_to) REFERENCES users(id),
        FOREIGN KEY (reported_by) REFERENCES users(id)
      )
    `);

    // Inventory table
    await query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2),
        supplier VARCHAR(100),
        reorder_level INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Admin privileges table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_privileges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        privilege VARCHAR(50) NOT NULL,
        granted_by INT NOT NULL,
        granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (granted_by) REFERENCES users(id),
        UNIQUE KEY unique_user_privilege (user_id, privilege)
      )
    `);

    // Client bookings table (for client-specific bookings)
    await query(`
      CREATE TABLE IF NOT EXISTS client_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
      )
    `);

    // Price tracking table
    await query(`
      CREATE TABLE IF NOT EXISTS price_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_type_id INT NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        seasonal_multiplier DECIMAL(3,2) DEFAULT 1.00,
        weekend_multiplier DECIMAL(3,2) DEFAULT 1.20,
        holiday_multiplier DECIMAL(3,2) DEFAULT 1.50,
        demand_multiplier DECIMAL(3,2) DEFAULT 1.00,
        final_price DECIMAL(10,2) NOT NULL,
        effective_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_type_id) REFERENCES room_types(id)
      )
    `);

    // Cabins table (for different accommodation types)
    await query(`
      CREATE TABLE IF NOT EXISTS cabins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cabin_number VARCHAR(20) UNIQUE NOT NULL,
        cabin_type VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        amenities JSON,
        location VARCHAR(100),
        status VARCHAR(20) DEFAULT 'available',
        base_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Payment methods table
    await query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        config JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Guest preferences table
    await query(`
      CREATE TABLE IF NOT EXISTS guest_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guest_id INT NOT NULL,
        room_preference VARCHAR(50),
        floor_preference INT,
        amenities_preference JSON,
        special_requests TEXT,
        loyalty_points INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE
      )
    `);

    // Staff schedules table
    await query(`
      CREATE TABLE IF NOT EXISTS staff_schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        shift_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        shift_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // Notifications table
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        is_read BOOLEAN DEFAULT false,
        priority VARCHAR(10) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Room availability calendar
    await query(`
      CREATE TABLE IF NOT EXISTS room_availability (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT NOT NULL,
        date DATE NOT NULL,
        is_available BOOLEAN DEFAULT true,
        price_override DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
        UNIQUE KEY unique_room_date (room_id, date)
      )
    `);

    // Insert default data
    await insertDefaultData();

    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

const insertDefaultData = async () => {
  try {
    // Insert default super admin user
    const superAdminPassword = await require('bcryptjs').hash('superadmin123', 10);
    await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ('superadmin', 'superadmin@hotel.com', ?, 'Super', 'Admin', 'super_admin')
      ON DUPLICATE KEY UPDATE username = username
    `, [superAdminPassword]);

    // Insert default admin user
    const adminPassword = await require('bcryptjs').hash('admin123', 10);
    await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ('admin', 'admin@hotel.com', ?, 'Admin', 'User', 'admin')
      ON DUPLICATE KEY UPDATE username = username
    `, [adminPassword]);

    // Insert default departments
    await query(`
      INSERT IGNORE INTO departments (name, description) VALUES
      ('Front Office', 'Handles guest check-in, check-out, and general inquiries'),
      ('Housekeeping', 'Responsible for room cleaning and maintenance'),
      ('Food & Beverage', 'Manages restaurant, bar, and room service'),
      ('Maintenance', 'Handles building and equipment maintenance'),
      ('Human Resources', 'Manages employee relations and recruitment'),
      ('Finance', 'Handles accounting and financial operations')
    `);

    // Insert default room types
    await query(`
      INSERT IGNORE INTO room_types (name, description, base_price, capacity, amenities) VALUES
      ('Standard', 'Comfortable room with basic amenities', 100.00, 2, JSON_ARRAY('WiFi', 'TV', 'AC', 'Private Bathroom')),
      ('Deluxe', 'Spacious room with premium amenities', 150.00, 2, JSON_ARRAY('WiFi', 'TV', 'AC', 'Private Bathroom', 'Mini Bar', 'City View')),
      ('Suite', 'Luxury suite with separate living area', 250.00, 4, JSON_ARRAY('WiFi', 'TV', 'AC', 'Private Bathroom', 'Mini Bar', 'City View', 'Living Room', 'Kitchenette')),
      ('Presidential Suite', 'Ultimate luxury with all amenities', 500.00, 6, JSON_ARRAY('WiFi', 'TV', 'AC', 'Private Bathroom', 'Mini Bar', 'City View', 'Living Room', 'Kitchen', 'Jacuzzi', 'Butler Service'))
    `);

    // Insert default cabins
    await query(`
      INSERT IGNORE INTO cabins (cabin_number, cabin_type, capacity, amenities, location, base_price) VALUES
      ('CABIN-001', 'Mountain View Cabin', 4, JSON_ARRAY('Fireplace', 'Kitchen', 'Balcony', 'WiFi'), 'Mountain Side', 200.00),
      ('CABIN-002', 'Lake View Cabin', 6, JSON_ARRAY('Lake View', 'Kitchen', 'Hot Tub', 'WiFi'), 'Lake Front', 300.00),
      ('CABIN-003', 'Forest Cabin', 2, JSON_ARRAY('Nature View', 'Fireplace', 'WiFi'), 'Forest Area', 150.00),
      ('CABIN-004', 'Luxury Cabin', 8, JSON_ARRAY('Private Pool', 'Kitchen', 'Game Room', 'WiFi'), 'Premium Location', 500.00)
    `);

    // Insert default payment methods
    await query(`
      INSERT IGNORE INTO payment_methods (name, type, is_active, config) VALUES
      ('Credit Card', 'card', true, JSON_OBJECT('processor', 'stripe', 'currency', 'USD')),
      ('Debit Card', 'card', true, JSON_OBJECT('processor', 'stripe', 'currency', 'USD')),
      ('PayPal', 'digital_wallet', true, JSON_OBJECT('processor', 'paypal', 'currency', 'USD')),
      ('Bank Transfer', 'bank_transfer', true, JSON_OBJECT('processor', 'manual', 'currency', 'USD')),
      ('Cash', 'cash', true, JSON_OBJECT('processor', 'manual', 'currency', 'USD')),
      ('Chapa Payment', 'mobile_money', true, JSON_OBJECT('processor', 'chapa', 'currency', 'ETB'))
    `);

    // Insert default price tracking data
    await query(`
      INSERT IGNORE INTO price_tracking (room_type_id, base_price, seasonal_multiplier, weekend_multiplier, holiday_multiplier, demand_multiplier, final_price, effective_date) VALUES
      (1, 100.00, 1.00, 1.20, 1.50, 1.00, 100.00, CURDATE()),
      (2, 150.00, 1.00, 1.20, 1.50, 1.00, 150.00, CURDATE()),
      (3, 250.00, 1.00, 1.20, 1.50, 1.00, 250.00, CURDATE()),
      (4, 500.00, 1.00, 1.20, 1.50, 1.00, 500.00, CURDATE())
    `);

    console.log('✅ Default data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting default data:', error);
  }
};

if (require.main === module) {
  createTables();
}

module.exports = { createTables }; 
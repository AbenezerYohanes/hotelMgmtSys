require('dotenv').config({ path: './config.env' });
const bcrypt = require('bcryptjs');
const { query } = require('./server/database/config');

async function testLogin() {
  try {
    console.log('Testing login...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('JWT')));
    
    // Test 1: Check if admin user exists
    const userResult = await query(
      'SELECT id, username, email, password_hash, first_name, last_name, role, is_active FROM users WHERE username = ? OR email = ?',
      ['admin', 'admin@hotel.com']
    );
    
    console.log('User found:', userResult.rows.length > 0);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('User data:', {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      });
      
      // Test 2: Check password
      const testPassword = 'admin123';
      const isValidPassword = await bcrypt.compare(testPassword, user.password_hash);
      console.log('Password valid:', isValidPassword);
      
      // Test 3: Generate JWT token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log('JWT token generated:', !!token);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();

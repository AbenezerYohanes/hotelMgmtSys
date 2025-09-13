const { query } = require('./server/database/config');

async function showAdminCredentials() {
  try {
    console.log('🔐 Admin Credentials in Database:');
    console.log('================================');
    
    const result = await query(
      'SELECT username, email, first_name, last_name, role FROM users WHERE role IN ("admin", "super_admin") ORDER BY role DESC'
    );
    
    if (result.rows.length > 0) {
      result.rows.forEach(user => {
        console.log(`\n👤 ${user.role.toUpperCase()}:`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        console.log(`   Password: ${user.role === 'super_admin' ? 'superadmin123' : 'admin123'}`);
      });
    } else {
      console.log('❌ No admin users found in database');
    }
    
    console.log('\n📋 Login Instructions:');
    console.log('1. Go to: http://localhost:3000');
    console.log('2. Use the credentials above to log in');
    console.log('3. Super Admin will redirect to /super-admin');
    console.log('4. Admin will redirect to /admin');
    
  } catch (error) {
    console.error('❌ Error fetching admin credentials:', error);
  } finally {
    process.exit(0);
  }
}

showAdminCredentials();

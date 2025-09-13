const { query } = require('./server/database/config');

async function checkAllUsers() {
  try {
    console.log('🔍 All Users in Database:');
    console.log('========================');
    
    const result = await query(
      'SELECT id, username, email, first_name, last_name, role FROM users ORDER BY id'
    );
    
    if (result.rows.length > 0) {
      result.rows.forEach(user => {
        console.log(`\n👤 ID: ${user.id} | Role: ${user.role.toUpperCase()}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        
        // Determine password based on role
        let password = '';
        if (user.role === 'super_admin') {
          password = 'superadmin123';
        } else if (user.role === 'admin') {
          password = 'admin123';
        } else {
          password = 'Register new account';
        }
        console.log(`   Password: ${password}`);
      });
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
  } finally {
    process.exit(0);
  }
}

checkAllUsers();

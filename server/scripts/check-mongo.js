const connectDB = require('../config/database');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB - creating test user');
    const existing = await User.findOne({ email: 'migration-test@example.com' }).lean();
    if (!existing) {
      const u = await User.create({ email: 'migration-test@example.com', password_hash: 'test', first_name: 'Migration', last_name: 'Test' });
      console.log('Created test user:', u._id.toString());
    } else {
      console.log('Test user already exists:', existing._id.toString());
    }
    process.exit(0);
  } catch (err) {
    console.error('MongoDB check failed:', err);
    process.exit(1);
  }
})();

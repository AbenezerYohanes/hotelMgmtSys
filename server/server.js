require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const session = require('express-session');
let MySQLStore;
try {
  MySQLStore = require('express-mysql-session')(session);
} catch (e) {
  // express-mysql-session not installed — sessions will fallback to in-memory (not recommended for production)
  console.warn('express-mysql-session not installed; session store will use default MemoryStore');
}

// Use the db bootstrap (loads models and exports .sequelize + models)
const db = require('./config/db');
const sequelize = db.sequelize;

// Route modules (ensure these exist under server/routes)
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const roomRoutes = require('./routes/rooms');
const hrRoutes = require('./routes/hr');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'], credentials: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Session store
let sessionStore;
if (MySQLStore) {
  sessionStore = new MySQLStore({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_management'
  });
}

app.use(session({
  key: 'hotel_session',
  secret: process.env.SESSION_SECRET || 'supersecret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Health-check
app.get('/api/health', (req, res) => res.json({ status: 'OK', database: 'MySQL (Sequelize)' }));

// Sequelize connection and sync (optional alter)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected...');
    const doSync = process.env.DB_SYNC === 'true';
    if (doSync) {
      await sequelize.sync({ alter: true });
      console.log('Database synced (alter).');
    }
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

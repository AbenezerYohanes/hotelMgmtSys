require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/employees', require('./routes/employees'));
app.use('/api/v1/rooms', require('./routes/rooms'));
app.use('/api/v1/reservations', require('./routes/reservations'));
app.use('/api/v1/billing', require('./routes/billing'));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
require('dotenv').config();
const express = require('express');
const http = require('http');
const { initDb } = require('./config/database');
const { helmet, apiLimiter, cors: corsMiddleware } = require('./middleware/security');
const authRoutes = require('./routes/auth');
const superadminRoutes = require('./routes/superadmin');
const adminRoutes = require('./routes/admin');
const staffRoutes = require('./routes/staff');
const receptionistRoutes = require('./routes/receptionist');
const guestRoutes = require('./routes/guest');
const paymentsRoutes = require('./routes/payments');
const reportsRoutes = require('./routes/reports');
const seedFlag = process.env.SEED_SAMPLE_DATA === 'true';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

app.use(helmet());
app.use(corsMiddleware());
app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }));

// attach socket to app for controllers
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

const PORT = process.env.PORT || 4000;

initDb().then(async (sequelize) => {
  if (seedFlag) {
    try {
      await require('./seeders/seed')();
      console.log('Seed complete');
    } catch (err) {
      console.error('Seed error', err);
    }
  }
  server.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});

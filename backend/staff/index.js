require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// basic health
app.get('/staff/health', (req, res) => res.json({ ok: true }));

// load routes if present
try { app.use('/staff/auth', require('./routes/auth')); } catch(e){}
try { app.use('/staff/profile', require('./routes/profile')); } catch(e){}
try { app.use('/staff/bookings', require('./routes/bookings')); } catch(e){}
try { app.use('/staff/rooms', require('./routes/rooms')); } catch(e){}
try { app.use('/staff/requests', require('./routes/requests')); } catch(e){}
try { app.use('/staff/maintenance', require('./routes/maintenance')); } catch(e){}
try { app.use('/staff/schedules', require('./routes/schedules')); } catch(e){}
try { app.use('/staff/notifications', require('./routes/notifications')); } catch(e){}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.STAFF_PORT || 4001;

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(PORT, () => console.log(`Staff API running on port ${PORT}`)))
  .catch(err => console.error('DB connection failed', err));

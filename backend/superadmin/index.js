require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use('/api/superadmin', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
sequelize.authenticate()
  .then(() => console.log('DB connection OK'))
  .catch((err) => console.error('DB conn error', err));

app.listen(PORT, () => console.log(`SuperAdmin API listening on ${PORT}`));

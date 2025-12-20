const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

function helmetMiddleware() {
  return helmet();
}

const apiLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 300 });

function corsMiddleware() {
  return cors({ origin: '*' });
}

module.exports = { helmetMiddleware, apiLimiter, corsMiddleware };
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = { helmet, apiLimiter, cors: () => cors(corsOptions) };

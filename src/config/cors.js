const cors = require('cors');

const raw = process.env.CORS_ALLOWED_ORIGINS || '*';
const allowAll = raw.trim() === '*';
const whitelist = allowAll ? [] : raw.split(',').map(s => s.trim()).filter(Boolean);

const options = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowAll) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(options);
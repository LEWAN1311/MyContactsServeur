const cors = require('cors');

// Function to create CORS configuration
function createCorsConfig() {
  // Get CORS configuration from environment variables
  const raw = process.env.CORS_ALLOWED_ORIGINS || '*';
  const allowAll = raw.trim() === '*';
  const whitelist = allowAll ? [] : raw.split(',').map(s => s.trim()).filter(Boolean);

  // Debug logging
  console.log('CORS Configuration:');
  console.log('CORS_ALLOWED_ORIGINS from env:', process.env.CORS_ALLOWED_ORIGINS);
  console.log('Raw value:', raw);
  console.log('Allow all:', allowAll);
  console.log('Whitelist:', whitelist);

  return {
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) {
        console.log('CORS: Allowing request with no origin');
        return callback(null, true);
      }
      
      if (allowAll) {
        console.log(`CORS: Allowing all origins - ${origin}`);
        return callback(null, true);
      }
      
      if (whitelist.includes(origin)) {
        console.log(`CORS: Allowing whitelisted origin - ${origin}`);
        return callback(null, true);
      }
      
      console.log(`CORS: Rejected origin - ${origin}`);
      console.log(`CORS: Allowed origins - ${whitelist.join(', ')}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'Origin', 
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  };
}

// Create and export the CORS middleware
module.exports = cors(createCorsConfig());
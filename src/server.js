// Load environment variables from root directory
require('dotenv').config({ path: '../.env' });

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDb } = require('./config/db');
const requireAuth = require('./middlewares/auth.middleware');
const errorHandle = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const cors = require('./config/cors');

const app = express();
app.use(express.json());
app.use(cors);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyContactsAPI",
      version: "1.0.0",
      description: "An API authorization with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3080",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./server.js", "./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});
// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/contacts', contactRoutes);

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access protected route
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected route accessed
 *       401:
 *         description: Unauthorized
 */
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you have accessed a protected route!` });
});

// CORS error handling middleware
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('Not allowed by CORS')) {
    console.error('CORS Error:', err.message);
    return res.status(403).json({
      ok: false,
      error: {
        status: 403,
        message: 'CORS: Not allowed by CORS policy',
        details: err.message
      }
    });
  }
  next(err);
});

app.use(errorHandle);

const port = process.env.PORT || 3080;

(async () => {
  try {
    await connectDb();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${port}/`);
      console.log(`Swagger docs at http://0.0.0.0:${port}/api-docs`);
      console.log(`CORS allowed origins: ${process.env.CORS_ALLOWED_ORIGINS || '*'}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB connection error:', err?.message || err);
    process.exit(1);
  }
})();
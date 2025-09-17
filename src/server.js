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

app.use(errorHandle);

const port = process.env.PORT || 3080;

(async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
      console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB connection error:', err?.message || err);
    process.exit(1);
  }
})();
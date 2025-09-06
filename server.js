const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('./db');
const requireAuth = require('./middleware/requireAuth');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

// Swagger config
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
        url: "http://localhost:3000",
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
  apis: ["./serveur.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *       401:
 *         description: Invalid credentials
 */

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

// Auth routes
app.use('/auth', authRoutes);

// Protected route
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have accessed a protected route!` });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/submit-form', (req, res) => {
  res.send('Form submitted');
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
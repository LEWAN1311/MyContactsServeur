# MyContacts API Server

A RESTful API server built with Node.js, Express.js, and MongoDB for managing personal contacts with user authentication and authorization.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: JWT-based authentication system
- **Contact Management**: Full CRUD operations for contacts
- **Data Validation**: Phone number validation (10-20 digits, numeric only)
- **Duplicate Prevention**: Prevents duplicate phone numbers per user
- **User Isolation**: Users can only access their own contacts
- **API Documentation**: Interactive Swagger UI documentation
- **Error Handling**: Centralized error handling with custom error classes
- **CORS Support**: Configurable CORS for cross-origin requests
- **MongoDB Integration**: Mongoose ODM for database operations

## 🏗️ Project Structure

```
MyContactsServeur/
├── src/
│   ├── config/
│   │   ├── cors.js          # CORS configuration
│   │   └── db.js            # MongoDB connection setup
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication controllers
│   │   └── contact.controller.js # Contact CRUD controllers
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   └── error.middleware.js   # Global error handling
│   ├── models/
│   │   ├── contact.model.js      # Contact Mongoose schema
│   │   └── user.model.js         # User Mongoose schema
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication routes
│   │   └── contact.routes.js     # Contact CRUD routes
│   ├── services/
│   │   ├── auth.service.js       # Authentication business logic
│   │   └── contact.service.js    # Contact business logic
│   ├── utils/
│   │   └── apiReponse.js         # Custom error class
│   └── server.js                 # Main application entry point
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Dependency lock file
└── README.md                    # Project documentation
```

### Architecture Overview

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Models**: Define data schemas using Mongoose
- **Routes**: Define API endpoints and middleware
- **Middlewares**: Handle authentication and error processing
- **Config**: Application configuration files

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **MongoDB** (v4.4 or higher) or MongoDB Atlas account
- **Git** (for cloning the repository)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MyContactsLewan/MyContactsServeur.git
cd MyContactsServeur
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Required Libraries

The following libraries are automatically installed with `npm install`:

```bash
# Core dependencies
npm install express mongoose jsonwebtoken bcrypt cors

# Development dependencies
npm install nodemon

# Documentation
npm install swagger-ui-express swagger-jsdoc
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mycontacts?retryWrites=true&w=majority
MONGODB_DB=mycontacts

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3080
NODE_ENV=development

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Configuration Files

#### Database Configuration (`src/config/db.js`)
- Manages MongoDB connection using Mongoose
- Includes connection retry logic
- Handles graceful disconnection

#### CORS Configuration (`src/config/cors.js`)
- Configurable CORS origins
- Supports multiple allowed origins
- Allows credentials for authenticated requests

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Update `MONGODB_URI` in your `.env` file

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/mycontacts`

### Database Collections

The application automatically creates the following collections:

- **users**: Stores user authentication data
- **contacts**: Stores contact information with user references

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

This will start the server with nodemon for auto-restart on file changes.

### Production Mode

```bash
# Build the application (if needed)
npm run build

# Start the server
node src/server.js
```

### Server Output

When successfully started, you should see:

```
Connected to MongoDB via Mongoose!
Server running at http://localhost:3080/
Swagger docs at http://localhost:3080/api-docs
```

## 📚 API Documentation

Access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3080/api-docs`

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## 🔗 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |

### Contact Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/contacts` | Get user's contacts | Yes |
| POST | `/contacts` | Create new contact | Yes |
| PATCH | `/contacts/:id` | Update contact | Yes |
| DELETE | `/contacts/:id` | Delete contact | Yes |

### Utility Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/protected` | Test protected route | Yes |
| GET | `/` | Health check | No |

## 🔐 Authentication

### JWT Token Usage

1. **Register/Login** to get a JWT token
2. **Include token** in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Example Authentication Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:3080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Login to get token
curl -X POST http://localhost:3080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 3. Use token for protected routes
curl -X GET http://localhost:3080/contacts \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 📱 Contact Data Structure

### Contact Model

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

### Validation Rules

- **firstName**: Required, string
- **lastName**: Required, string
- **phone**: Required, string, 10-20 chiffres, numeric only, unique per contact

### Example Contact Operations

```bash
# Create a contact
curl -X POST http://localhost:3080/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890"
  }'

# Update a contact
curl -X PATCH http://localhost:3080/contacts/<contact-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Jane",
    "phone": "0987654321"
  }'
```

## ⚠️ Error Handling

### Error Response Format

```json
{
  "ok": false,
  "error": {
    "status": 400,
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **204**: No Content (successful delete)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (invalid token)
- **404**: Not Found
- **409**: Conflict (duplicate phone number)
- **500**: Internal Server Error

### Example Error Responses

```json
// Validation Error
{
  "ok": false,
  "error": {
    "status": 400,
    "message": "phone must be 10-20 characters and contain only numeric digits"
  }
}

// Duplicate Phone Error
{
  "ok": false,
  "error": {
    "status": 409,
    "message": "A contact with this phone number already exists"
  }
}

// Authentication Error
{
  "ok": false,
  "error": {
    "status": 401,
    "message": "Unauthorized: User information is missing"
  }
}
```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**:
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-secret-key
   PORT=3000
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

2. **Install Production Dependencies**:
   ```bash
   npm install --production
   ```

### Deployment Options

#### Option 1: Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
   ```bash
   git push heroku main
   ```

#### Option 2: DigitalOcean/AWS

1. Set up a VPS or EC2 instance
2. Install Node.js and PM2
3. Clone repository and install dependencies
4. Use PM2 to manage the process:
   ```bash
   pm2 start src/server.js --name "mycontacts-api"
   pm2 startup
   pm2 save
   ```

#### Option 3: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
EXPOSE 3080
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t mycontacts-api .
docker run -p 3080:3080 mycontacts-api
```

### Production Checklist

- [ ] Set secure JWT secret
- [ ] Configure production MongoDB URI
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🧪 Testing

### Manual Testing with curl

```bash
# Test registration
curl -X POST http://localhost:3080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected route
curl -X GET http://localhost:3080/protected \
  -H "Authorization: Bearer <token>"
```

### Testing with Swagger UI

1. Navigate to `http://localhost:3080/api-docs`
2. Use the "Authorize" button to set your JWT token
3. Test endpoints directly from the interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tran Dang Quang LE (Lewan)**
- GitHub: [@MyContactsLewan](https://github.com/MyContactsLewan)
- Repository: [MyContactsServeur](https://github.com/MyContactsLewan/MyContactsServeur)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](http://localhost:3080/api-docs)
2. Review the error messages in the console
3. Check your environment variables
4. Ensure MongoDB is running and accessible
5. Open an issue on GitHub

---

**Happy Coding! 🚀**

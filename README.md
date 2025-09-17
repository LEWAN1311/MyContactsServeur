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
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: JWT-based authentication system with secure token generation
- **Contact Management**: Full CRUD operations for contacts with user-scoped access
- **Data Validation**: Phone number validation (10-20 digits, numeric only)
- **Duplicate Prevention**: Prevents duplicate phone numbers per user
- **User Isolation**: Users can only access their own contacts
- **API Documentation**: Interactive Swagger UI documentation with authentication support
- **Error Handling**: Centralized error handling with custom error classes and detailed logging
- **CORS Support**: Advanced CORS configuration with environment-based origins and debugging
- **MongoDB Integration**: Mongoose ODM for database operations with connection management
- **Environment Configuration**: Flexible environment variable support with dotenv
- **Production Ready**: Optimized for deployment with proper error handling and logging
- **Comprehensive Testing**: Full test suite with 91/91 tests passing (100% success rate)

## 🏗️ Project Structure

```
MyContactsServeur/
├── src/
│   ├── config/
│   │   ├── cors.js              # CORS configuration
│   │   └── db.js                # MongoDB connection setup with Mongoose
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication controllers
│   │   └── contact.controller.js # Contact CRUD controllers
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT authentication middleware
│   │   └── error.middleware.js  # Global error handling middleware
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
│   │   └── apiReponse.js        # Custom ApiError class
│   └── server.js                # Main application entry point
├── tests/                       # Comprehensive test suite
│   ├── models/                  # Model tests
│   ├── services/                # Service tests
│   ├── routes/                  # Route integration tests
│   ├── middlewares/             # Middleware tests
│   ├── setup.js                 # Test setup with MongoDB Memory Server
│   └── README.md                # Testing documentation
├── .env                         # Environment variables (not in git)
├── package.json                 # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── jest.config.js              # Jest testing configuration
└── README.md                   # Project documentation
```

### Architecture Overview

- **Controllers**: Handle HTTP requests and responses with proper error handling
- **Services**: Contain business logic and database operations with validation
- **Models**: Define data schemas using Mongoose with proper validation
- **Routes**: Define API endpoints and middleware with authentication
- **Middlewares**: Handle authentication, CORS, and error processing
- **Config**: Application configuration files for CORS and database
- **Tests**: Comprehensive test suite covering all components

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **MongoDB** (v4.4 or higher) or MongoDB Atlas account
- **Git** (for cloning the repository)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/LEWAN1311/MyContactsServeur.git
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
npm install express mongoose jsonwebtoken bcrypt cors dotenv

# Development dependencies
npm install nodemon

# Testing dependencies
npm install jest supertest mongodb-memory-server

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

# CORS Configuration
# Comma-separated list of allowed origins, or '*' for all origins
# Examples: 
# - For development: http://localhost:3000,http://localhost:3001
# - For production: https://yourdomain.com,https://www.yourdomain.com
# - For all origins: *
CORS_ALLOWED_ORIGINS=*

# Node Environment
# Values: development, production, test
NODE_ENV=development
```

### Environment Setup Instructions

1. **Create .env file**: `touch .env`
2. **Update the values** with your actual configuration
3. **Install dotenv**: `npm install dotenv` (already included)
4. **The server will automatically load** these variables

### Configuration Files

#### Database Configuration (`src/config/db.js`)
- Manages MongoDB connection using Mongoose
- Includes connection retry logic
- Handles graceful disconnection

#### CORS Configuration (`src/config/cors.js`)
- Advanced CORS configuration with environment-based origins
- Supports multiple allowed origins and wildcards
- Allows credentials for authenticated requests
- Detailed logging for debugging CORS issues
- Handles preflight requests properly

#### Server Configuration (`src/server.js`)
- Loads environment variables with dotenv
- Binds to all interfaces (0.0.0.0) for deployment
- Includes CORS error handling middleware
- Comprehensive logging for debugging

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
CORS Configuration:
CORS_ALLOWED_ORIGINS from env: https://yourdomain.com, https://www.yourdomain.com
Raw value: https://yourdomain.com, https://www.yourdomain.com
Allow all: false
Whitelist: ['https://yourdomain.com', 'https://www.yourdomain.com']
Connected to MongoDB (Mongoose)
Server running at http://0.0.0.0:3080/
Swagger docs at http://0.0.0.0:3080/api-docs
CORS allowed origins: https://yourdomain.com, https://www.yourdomain.com
```

## 📚 API Documentation

Access the interactive API documentation at:
- **Swagger UI**: `http://yourdomain.com/api-docs`

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
   PORT=3080
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

2. **Install Production Dependencies**:
   ```bash
   npm install --production
   ```

### Deployment Options

#### Option 1: Render (Recommended) 🎯

[Render](https://render.com) is a modern cloud platform that makes deployment simple and reliable.

##### Prerequisites for Render Deployment

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Set up a production MongoDB database
3. **Render Account**: Sign up at [render.com](https://render.com)

##### Step-by-Step Render Deployment

1. **Connect Your Repository**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `MyContactsServeur` repository

2. **Configure the Web Service**:
   ```
   Name: mycontacts-api (or your preferred name)
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: (leave empty - it's in root)
   Build Command: npm install
   Start Command: cd src && node server.js
   ```

3. **Set Environment Variables**:
   In the Render dashboard, go to "Environment" tab and add:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mycontacts?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   PORT=3080
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

4. **Advanced Settings**:
   - **Auto-Deploy**: Yes (deploys on every push to main)
   - **Pull Request Previews**: Yes (optional)
   - **Health Check Path**: `/` (uses your health check endpoint)

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Wait for deployment to complete (usually 2-3 minutes)

##### Render-Specific Configuration

**Update your server.js for Render compatibility**:

```javascript
// The server.js is already configured for Render with:
// - Binds to 0.0.0.0 (required for Render)
// - Uses process.env.PORT (Render provides this)
// - Proper CORS configuration
// - Environment variable loading
```

**Render Environment Variables**:
- `PORT`: Automatically provided by Render (don't set manually)
- `NODE_ENV`: Set to `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string
- `CORS_ALLOWED_ORIGINS`: Your frontend domain(s)

##### Render Deployment Benefits

- ✅ **Automatic HTTPS**: SSL certificates provided automatically
- ✅ **Zero-Downtime Deploys**: Blue-green deployments
- ✅ **Auto-Scaling**: Handles traffic spikes automatically
- ✅ **Built-in Monitoring**: Performance metrics and logs
- ✅ **Custom Domains**: Easy custom domain setup
- ✅ **Environment Management**: Secure environment variable management
- ✅ **Git Integration**: Automatic deployments on push

##### Render Troubleshooting

**Common Issues and Solutions**:

1. **Build Failures**:
   ```bash
   # Check your package.json scripts
   # Ensure all dependencies are in package.json
   # Verify Node.js version compatibility
   ```

2. **CORS Issues**:
   ```bash
   # Set CORS_ALLOWED_ORIGINS in Render environment variables
   # Use your actual frontend domain (not localhost)
   # Check server logs for CORS rejection messages
   ```

3. **Database Connection Issues**:
   ```bash
   # Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)
   # Check MONGODB_URI format
   # Ensure database user has proper permissions
   ```

4. **Environment Variables Not Loading**:
   ```bash
   # Check variable names in Render dashboard
   # Ensure no typos in variable names
   # Restart the service after adding variables
   ```

##### Render Monitoring and Logs

- **View Logs**: Go to your service → "Logs" tab
- **Monitor Performance**: "Metrics" tab shows CPU, memory, response times
- **Health Checks**: Automatic health monitoring at `/` endpoint
- **Alerts**: Set up notifications for deployment failures

#### Option 2: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**:
   ```bash
   heroku create mycontacts-api
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set CORS_ALLOWED_ORIGINS=https://your-domain.com
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

#### Option 3: DigitalOcean/AWS

1. **Set up VPS/EC2 instance** with Node.js
2. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

3. **Deploy and Start**:
   ```bash
   git clone your-repo
   cd MyContactsServeur
   npm install --production
   pm2 start src/server.js --name "mycontacts-api"
   pm2 startup
   pm2 save
   ```

#### Option 4: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
COPY .env.example .env
EXPOSE 3080
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t mycontacts-api .
docker run -p 3080:3080 --env-file .env mycontacts-api
```

### Production Checklist

- [ ] Set secure JWT secret (use crypto.randomBytes)
- [ ] Configure production MongoDB URI with proper permissions
- [ ] Set up proper CORS origins (not `*` in production)
- [ ] Enable HTTPS (automatic with Render)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Test all endpoints after deployment
- [ ] Verify CORS configuration with frontend
- [ ] Set up domain and DNS (if using custom domain)
- [ ] Configure environment variables securely

## 🧪 Testing

### Automated Testing

The project includes a comprehensive test suite with **91/91 tests passing (100% success rate)**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage

- **Model Tests**: User and Contact model validation and relationships
- **Service Tests**: Authentication and contact business logic
- **Route Tests**: API endpoint integration tests
- **Middleware Tests**: Authentication and error handling
- **Total**: 91 tests across 7 test suites

### Test Environment

- **Framework**: Jest with Supertest for HTTP testing
- **Database**: MongoDB Memory Server for isolated testing
- **Coverage**: ~90% code coverage
- **Setup**: Automated test environment with cleanup

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

# Test CORS
curl -H "Origin: http://localhost:3000" \
     -H "Content-Type: application/json" \
     -X OPTIONS \
     http://localhost:3080/auth/login
```

### Testing with Swagger UI

1. Navigate to `http://yourdomain.com/api-docs`
2. Use the "Authorize" button to set your JWT token
3. Test endpoints directly from the interface
4. Verify CORS headers in browser network tab

### Testing Documentation

For detailed testing information, see [tests/README.md](tests/README.md).

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
- GitHub: [@LEWAN1311](https://github.com/LEWAN1311)
- Repository: [MyContactsServeur](https://github.com/LEWAN1311/MyContactsServeur)

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the API Documentation**: [https://mycontactsserveur.onrender.com/api-docs](https://mycontactsserveur.onrender.com/api-docs)
2. **Review Server Logs**: Check console output for CORS and environment variable information
3. **Verify Environment Variables**: Ensure `.env` file is in project root and variables are loaded
4. **Test CORS Configuration**: Check browser network tab for CORS errors
5. **Database Connection**: Ensure MongoDB Atlas is accessible and IP whitelist includes your deployment IP
6. **Run Tests**: Use `npm test` to verify all functionality works
7. **Check Deployment Logs**: For Render, check the "Logs" tab in your service dashboard
8. **Open an Issue**: [GitHub Issues](https://github.com/LEWAN1311/MyContactsServeur/issues)

### Common Issues

- **CORS Errors**: Set `CORS_ALLOWED_ORIGINS` to your frontend domain
- **Environment Variables Not Loading**: Ensure `.env` file is in project root
- **Database Connection Failed**: Check MongoDB Atlas IP whitelist and connection string
- **Authentication Issues**: Verify JWT_SECRET is set and token is included in Authorization header

---

## 🎉 **Current Status: Production Ready!**

✅ **91/91 tests passing (100% success rate)**  
✅ **Comprehensive CORS support with debugging**  
✅ **Environment-based configuration**  
✅ **Render deployment ready**  
✅ **Full API documentation with Swagger**  
✅ **Production-ready error handling**

**Happy Coding! 🚀**

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUser, authenticateUser, generateToken } = require('../../src/services/auth.service');
const User = require('../../src/models/user.model');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';

      const result = await registerUser(email, password);

      expect(result.ok).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.password).not.toBe(password); // Should be hashed

      // Verify user was saved to database
      const savedUser = await User.findOne({ email });
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toBe(email);
    });

    it('should return error for missing email', async () => {
      const result = await registerUser('', 'password123');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('Email and password are required');
    });

    it('should return error for missing password', async () => {
      const result = await registerUser('test@example.com', '');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('Email and password are required');
    });

    it('should return error for duplicate email', async () => {
      const email = 'duplicate@example.com';
      const password = 'password123';

      // Register first user
      await registerUser(email, password);

      // Try to register with same email
      const result = await registerUser(email, password);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(409);
      expect(result.message).toBe('Email already exists');
    });

    it('should hash password correctly', async () => {
      const email = 'hashtest@example.com';
      const password = 'password123';

      const result = await registerUser(email, password);
      expect(result.ok).toBe(true);

      const savedUser = await User.findOne({ email });
      const isPasswordHashed = await bcrypt.compare(password, savedUser.password);
      expect(isPasswordHashed).toBe(true);
    });
  });

  describe('authenticateUser', () => {
    const email = 'authuser@example.com';
    const password = 'password123';

    beforeEach(async () => {
      // Create a test user
      await registerUser(email, password);
    });

    it('should authenticate user with correct credentials', async () => {
      const result = await authenticateUser(email, password);

      expect(result.ok).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
    });

    it('should return error for incorrect email', async () => {
      const result = await authenticateUser('wrong@example.com', password);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(405);
      expect(result.message).toBe('Invalid credentials');
    });

    it('should return error for incorrect password', async () => {
      const result = await authenticateUser(email, 'wrongpassword');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(405);
      expect(result.message).toBe('Invalid credentials');
    });

    it('should return error for missing email', async () => {
      const result = await authenticateUser('', password);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('Email and password are required');
    });

    it('should return error for missing password', async () => {
      const result = await authenticateUser(email, '');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('Email and password are required');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'tokenuser@example.com',
      };

      const token = generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.user).toEqual(user);
    });

    it('should include expiration in token', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'expireuser@example.com',
      };

      const token = generateToken(user);
      const decoded = jwt.decode(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should set token expiration to 1 hour', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'expireuser@example.com',
      };

      const token = generateToken(user);
      const decoded = jwt.decode(token);
      const now = Math.floor(Date.now() / 1000);
      const expiration = decoded.exp - now;

      // Should be approximately 1 hour (3600 seconds), allow 5 seconds tolerance
      expect(expiration).toBeGreaterThan(3595);
      expect(expiration).toBeLessThan(3605);
    });
  });
});

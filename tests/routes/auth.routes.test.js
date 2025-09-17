const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth.routes');
const User = require('../../src/models/user.model');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered');

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });

    it('should return 400 for missing email', async () => {
      const userData = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const userData = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Register first user
      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe('Email already exists');
    });

    it('should return 500 for server error', async () => {
      // Mock User.create to throw error
      const originalCreate = User.create;
      User.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const userData = {
        email: 'error@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(500);

      expect(response.body.message).toBe('Internal server error');

      // Restore original method
      User.create = originalCreate;
    });
  });

  describe('POST /auth/login', () => {
    const email = 'loginuser@example.com';
    const password = 'password123';

    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/auth/register')
        .send({ email, password });
    });

    it('should login user successfully', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email, password })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password })
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email })
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 405 for incorrect email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password })
        .expect(405);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 405 for incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email, password: 'wrongpassword' })
        .expect(405);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 500 for server error', async () => {
      // Mock User.findOne to throw error
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email, password })
        .expect(500);

      expect(response.body.message).toBe('Internal server error');

      // Restore original method
      User.findOne = originalFindOne;
    });
  });

});

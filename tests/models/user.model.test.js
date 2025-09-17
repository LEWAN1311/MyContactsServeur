const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).toBe(userData.password);
      expect(savedUser.creatAt).toBeDefined();
    });

    it('should set creatAt automatically', async () => {
      const userData = {
        email: 'test2@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.creatAt).toBeInstanceOf(Date);
    });
  });

  describe('User Validation', () => {
    it('should require email field', async () => {
      const user = new User({
        password: 'password123',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require password field', async () => {
      const user = new User({
        email: 'test@example.com',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        email: 'unique@example.com',
        password: 'password123',
      };

      // Create first user
      await new User(userData).save();

      // Try to create second user with same email
      const duplicateUser = new User(userData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should accept valid email format', async () => {
      const userData = {
        email: 'valid.email+tag@example.co.uk',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe(userData.email);
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create test users
      await User.create([
        { email: 'user1@example.com', password: 'password1' },
        { email: 'user2@example.com', password: 'password2' },
      ]);
    });

    it('should find user by email', async () => {
      const user = await User.findOne({ email: 'user1@example.com' });
      expect(user).toBeDefined();
      expect(user.email).toBe('user1@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await User.findOne({ email: 'nonexistent@example.com' });
      expect(user).toBeNull();
    });

    it('should find all users', async () => {
      const users = await User.find({});
      expect(users).toHaveLength(2);
    });
  });
});

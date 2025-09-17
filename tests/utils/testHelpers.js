const jwt = require('jsonwebtoken');
const User = require('../../src/models/user.model');
const Contact = require('../../src/models/contact.model');

/**
 * Create a test user and return the user object
 */
const createTestUser = async (userData = {}) => {
  const defaultData = {
    email: 'test@example.com',
    password: 'password123',
  };
  
  const user = await User.create({ ...defaultData, ...userData });
  return user;
};

/**
 * Create a test contact and return the contact object
 */
const createTestContact = async (userId, contactData = {}) => {
  const defaultData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '1234567890',
  };
  
  const contact = await Contact.create({
    userId,
    ...defaultData,
    ...contactData,
  });
  return contact;
};

/**
 * Generate a JWT token for testing
 */
const generateTestToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET);
};

/**
 * Create a test user with token
 */
const createTestUserWithToken = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateTestToken(user);
  return { user, token };
};

/**
 * Create multiple test contacts for a user
 */
const createMultipleTestContacts = async (userId, count = 3) => {
  const contacts = [];
  for (let i = 0; i < count; i++) {
    const contact = await createTestContact(userId, {
      firstName: `User${i + 1}`,
      lastName: `LastName${i + 1}`,
      phone: `123456789${i}`,
    });
    contacts.push(contact);
  }
  return contacts;
};

/**
 * Clean up test data
 */
const cleanupTestData = async () => {
  await User.deleteMany({});
  await Contact.deleteMany({});
};

/**
 * Wait for a specified amount of time (useful for testing timeouts)
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock console methods to avoid test output noise
 */
const mockConsole = () => {
  const originalConsole = { ...console };
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  
  return {
    restore: () => {
      Object.assign(console, originalConsole);
    }
  };
};

module.exports = {
  createTestUser,
  createTestContact,
  generateTestToken,
  createTestUserWithToken,
  createMultipleTestContacts,
  cleanupTestData,
  wait,
  mockConsole,
};

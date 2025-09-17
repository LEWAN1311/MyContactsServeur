const mongoose = require('mongoose');
const Contact = require('../../src/models/contact.model');
const User = require('../../src/models/user.model');

describe('Contact Model', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  describe('Contact Creation', () => {
    it('should create a contact with valid data', async () => {
      const contactData = {
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const contact = new Contact(contactData);
      const savedContact = await contact.save();

      expect(savedContact._id).toBeDefined();
      expect(savedContact.userId.toString()).toBe(testUser._id.toString());
      expect(savedContact.firstName).toBe(contactData.firstName);
      expect(savedContact.lastName).toBe(contactData.lastName);
      expect(savedContact.phone).toBe(contactData.phone);
    });
  });

  describe('Contact Validation', () => {
    it('should require userId field', async () => {
      const contact = new Contact({
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      });

      await expect(contact.save()).rejects.toThrow();
    });

    it('should require firstName field', async () => {
      const contact = new Contact({
        userId: testUser._id,
        lastName: 'Doe',
        phone: '1234567890',
      });

      await expect(contact.save()).rejects.toThrow();
    });

    it('should require lastName field', async () => {
      const contact = new Contact({
        userId: testUser._id,
        firstName: 'John',
        phone: '1234567890',
      });

      await expect(contact.save()).rejects.toThrow();
    });

    it('should require phone field', async () => {
      const contact = new Contact({
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
      });

      await expect(contact.save()).rejects.toThrow();
    });

    it('should enforce phone length constraints', async () => {
      // Test phone too short
      const shortPhoneContact = new Contact({
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '123', // Too short
      });

      await expect(shortPhoneContact.save()).rejects.toThrow();

      // Test phone too long
      const longPhoneContact = new Contact({
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789012345678901', // Too long (21 digits)
      });

      await expect(longPhoneContact.save()).rejects.toThrow();
    });
  });

  describe('Contact Queries', () => {
    beforeEach(async () => {
      // Create test contacts
      await Contact.create([
        {
          userId: testUser._id,
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
        {
          userId: testUser._id,
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '0987654321',
        },
      ]);
    });

    it('should find contacts by userId', async () => {
      const contacts = await Contact.find({ userId: testUser._id });
      expect(contacts).toHaveLength(2);
    });

    it('should find contact by phone', async () => {
      const contact = await Contact.findOne({ phone: '1234567890' });
      expect(contact).toBeDefined();
      expect(contact.firstName).toBe('John');
    });

    it('should return empty array for non-existent userId', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const contacts = await Contact.find({ userId: nonExistentUserId });
      expect(contacts).toHaveLength(0);
    });
  });

  describe('Contact Relationships', () => {
    it('should reference correct user', async () => {
      const contactData = {
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const contact = await Contact.create(contactData);
      const populatedContact = await Contact.findById(contact._id).populate('userId');

      expect(populatedContact.userId._id.toString()).toBe(testUser._id.toString());
      expect(populatedContact.userId.email).toBe(testUser.email);
    });
  });
});

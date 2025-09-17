const request = require('supertest');
const express = require('express');
const contactRoutes = require('../../src/routes/contact.routes');
const User = require('../../src/models/user.model');
const Contact = require('../../src/models/contact.model');
const jwt = require('jsonwebtoken');
const errorHandle = require('../../src/middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use('/contacts', contactRoutes);
// Add error middleware to handle ApiError responses
app.use(errorHandle);

// Helper function to create auth token
const createAuthToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET);
};

describe('Contact Routes', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      email: 'contactuser@example.com',
      password: 'password123',
    });

    authToken = createAuthToken(testUser);
  });

  describe('GET /contacts', () => {
    it('should get user contacts successfully', async () => {
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

      const response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      // Order may vary, so check both exist
      const firstNames = response.body.map(c => c.firstName);
      expect(firstNames).toContain('John');
      expect(firstNames).toContain('Jane');
    });

    it('should return empty array for user with no contacts', async () => {
      const response = await request(app)
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/contacts')
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    it('should return 403 for invalid token', async () => {
      const response = await request(app)
        .get('/contacts')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('POST /contacts', () => {
    it('should create contact successfully', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(201);

      expect(response.body.firstName).toBe(contactData.firstName);
      expect(response.body.lastName).toBe(contactData.lastName);
      expect(response.body.phone).toBe(contactData.phone);

      // Verify contact was saved to database
      const savedContact = await Contact.findOne({ userId: testUser._id });
      expect(savedContact).toBeDefined();
    });

    it('should return 400 for missing request body', async () => {
      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.error.message).toBe('Request body is required');
    });

    it('should return 400 for missing required fields', async () => {
      const contactData = {
        firstName: 'John',
        // Missing lastName and phone
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error.message).toBe('firstName, lastName and phone are required');
    });

    it('should return 400 for invalid phone number', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '123', // Too short
      };

      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(400);

      expect(response.body.error.message).toBe('phone must be 10-20 characters and contain only numeric digits');
    });

    it('should return 409 for duplicate phone number', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      // Create first contact
      await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)
        .expect(201);

      // Try to create second contact with same phone
      const response = await request(app)
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '1234567890',
        })
        .expect(409);

      expect(response.body.error.message).toBe('A contact with this phone number already exists');
    });

    it('should return 401 for missing token', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const response = await request(app)
        .post('/contacts')
        .send(contactData)
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('PATCH /contacts/:id', () => {
    let testContact;

    beforeEach(async () => {
      testContact = await Contact.create({
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      });
    });

    it('should update contact successfully', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const response = await request(app)
        .patch(`/contacts/${testContact._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe('Jane');
      expect(response.body.lastName).toBe('Smith');
      expect(response.body.phone).toBe('1234567890'); // Should remain unchanged
    });

    it('should return 400 for missing request body', async () => {
      const response = await request(app)
        .patch(`/contacts/${testContact._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.error.message).toBe('Request body is required');
    });

    it('should return 400 for invalid phone number', async () => {
      const updateData = {
        phone: '123', // Too short
      };

      const response = await request(app)
        .patch(`/contacts/${testContact._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error.message).toBe('phone must be 10-20 characters and contain only numeric digits');
    });

    it('should return 404 for non-existent contact', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updateData = { firstName: 'Jane' };

      const response = await request(app)
        .patch(`/contacts/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.error.message).toBe('Contact not found');
    });

    it('should return 401 for missing token', async () => {
      const updateData = { firstName: 'Jane' };

      const response = await request(app)
        .patch(`/contacts/${testContact._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('DELETE /contacts/:id', () => {
    let testContact;

    beforeEach(async () => {
      testContact = await Contact.create({
        userId: testUser._id,
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      });
    });

    it('should delete contact successfully', async () => {
      await request(app)
        .delete(`/contacts/${testContact._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify contact was deleted
      const deletedContact = await Contact.findById(testContact._id);
      expect(deletedContact).toBeNull();
    });

    it('should return 404 for non-existent contact', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/contacts/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error.message).toBe('Contact not found');
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .delete(`/contacts/${testContact._id}`)
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    it('should only delete contact belonging to the user', async () => {
      // Create another user and contact
      const anotherUser = await User.create({
        email: 'another@example.com',
        password: 'password123',
      });

      const anotherContact = await Contact.create({
        userId: anotherUser._id,
        firstName: 'Another',
        lastName: 'Contact',
        phone: '0987654321',
      });

      // Try to delete another user's contact
      const response = await request(app)
        .delete(`/contacts/${anotherContact._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error.message).toBe('Contact not found');

      // Verify contact still exists
      const stillExists = await Contact.findById(anotherContact._id);
      expect(stillExists).toBeDefined();
    });
  });
});

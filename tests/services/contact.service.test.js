const { getContactsByIds, create, updateContactById, deleteContactById } = require('../../src/services/contact.service');
const Contact = require('../../src/models/contact.model');
const User = require('../../src/models/user.model');

describe('Contact Service', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      email: 'contactuser@example.com',
      password: 'password123',
    });
  });

  describe('getContactsByIds', () => {
    it('should return empty array for user with no contacts', async () => {
      const contacts = await getContactsByIds(testUser._id);
      expect(contacts).toEqual([]);
    });

    it('should return user contacts', async () => {
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

      const contacts = await getContactsByIds(testUser._id);
      expect(contacts).toHaveLength(2);
      // Order may vary, so check both exist
      const firstNames = contacts.map(c => c.firstName);
      expect(firstNames).toContain('John');
      expect(firstNames).toContain('Jane');
    });

    it('should only return contacts for specified user', async () => {
      // Create another user
      const anotherUser = await User.create({
        email: 'another@example.com',
        password: 'password123',
      });

      // Create contacts for both users
      await Contact.create([
        {
          userId: testUser._id,
          firstName: 'User1Contact',
          lastName: 'Doe',
          phone: '1111111111',
        },
        {
          userId: anotherUser._id,
          firstName: 'User2Contact',
          lastName: 'Smith',
          phone: '2222222222',
        },
      ]);

      const contacts = await getContactsByIds(testUser._id);
      expect(contacts).toHaveLength(1);
      expect(contacts[0].firstName).toBe('User1Contact');
    });
  });

  describe('create', () => {
    it('should create a contact successfully', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const result = await create(testUser._id, contactData);

      expect(result.ok).toBe(true);
      expect(result.contact).toBeDefined();
      expect(result.contact.firstName).toBe(contactData.firstName);
      expect(result.contact.lastName).toBe(contactData.lastName);
      expect(result.contact.phone).toBe(contactData.phone);

      // Verify contact was saved to database
      const savedContact = await Contact.findOne({ userId: testUser._id });
      expect(savedContact).toBeDefined();
    });

    it('should return error for missing userId', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      const result = await create(null, contactData);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('userId is required');
    });

    it('should return error for missing required fields', async () => {
      const result = await create(testUser._id, {});

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('firstName, lastName and phone are required');
    });

    it('should return error for invalid phone number', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '123', // Too short
      };

      const result = await create(testUser._id, contactData);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('phone must be 10-20 characters and contain only numeric digits');
    });

    it('should return error for duplicate phone number', async () => {
      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      // Create first contact
      await create(testUser._id, contactData);

      // Try to create second contact with same phone
      const result = await create(testUser._id, {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '1234567890',
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(409);
      expect(result.message).toBe('A contact with this phone number already exists');
    });

    it('should allow same phone for different users', async () => {
      const anotherUser = await User.create({
        email: 'another@example.com',
        password: 'password123',
      });

      const contactData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      };

      // Create contact for first user
      const result1 = await create(testUser._id, contactData);
      expect(result1.ok).toBe(true);

      // Create contact for second user with same phone
      const result2 = await create(anotherUser._id, contactData);
      expect(result2.ok).toBe(true);
    });
  });

  describe('updateContactById', () => {
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

      const result = await updateContactById(testContact._id, updateData, testUser._id);

      expect(result.ok).toBe(true);
      expect(result.contact.firstName).toBe('Jane');
      expect(result.contact.lastName).toBe('Smith');
      expect(result.contact.phone).toBe('1234567890'); // Should remain unchanged
    });

    it('should return error for missing userId', async () => {
      const updateData = { firstName: 'Jane' };
      const result = await updateContactById(testContact._id, updateData, null);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('userId is required');
    });

    it('should return error for non-existent contact', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updateData = { firstName: 'Jane' };
      const result = await updateContactById(nonExistentId, updateData, testUser._id);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Contact not found');
    });

    it('should return error for invalid phone number', async () => {
      const updateData = { phone: '123' }; // Too short
      const result = await updateContactById(testContact._id, updateData, testUser._id);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('phone must be 10-20 characters and contain only numeric digits');
    });

    it('should return error for duplicate phone number', async () => {
      // Create another contact
      await Contact.create({
        userId: testUser._id,
        firstName: 'Another',
        lastName: 'Contact',
        phone: '0987654321',
      });

      // Try to update first contact with second contact's phone
      const updateData = { phone: '0987654321' };
      const result = await updateContactById(testContact._id, updateData, testUser._id);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(409);
      expect(result.message).toBe('A contact with this phone number already exists');
    });

    it('should allow updating to same phone number', async () => {
      const updateData = { phone: '1234567890' }; // Same phone
      const result = await updateContactById(testContact._id, updateData, testUser._id);

      expect(result.ok).toBe(true);
      expect(result.contact.phone).toBe('1234567890');
    });
  });

  describe('deleteContactById', () => {
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
      const result = await deleteContactById(testContact._id, testUser._id);

      expect(result.ok).toBe(true);

      // Verify contact was deleted
      const deletedContact = await Contact.findById(testContact._id);
      expect(deletedContact).toBeNull();
    });

    it('should return error for missing userId', async () => {
      const result = await deleteContactById(testContact._id, null);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe('userId is required');
    });

    it('should return error for non-existent contact', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const result = await deleteContactById(nonExistentId, testUser._id);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Contact not found');
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
      const result = await deleteContactById(anotherContact._id, testUser._id);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Contact not found');

      // Verify contact still exists
      const stillExists = await Contact.findById(anotherContact._id);
      expect(stillExists).toBeDefined();
    });
  });
});

const express = require('express');
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contact.controller');
const requireAuth = require('../middlewares/auth.middleware');
const router = express.Router();

// All contact routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: List contacts for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *       401:
 *         description: Unauthorized
 */
router.get('/', getContacts);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Partially update a contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', deleteContact);

module.exports = router;

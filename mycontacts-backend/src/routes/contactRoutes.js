const express = require('express');
const { createContact, getContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const { authJwt } = require('../middlewares/authMiddleware');
const { runValidation, createContactValidator, updateContactValidator } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(authJwt);

router.post('/', createContactValidator, runValidation, createContact);
router.get('/', getContacts);

router.get('/:id', getContactById);
router.patch('/:id', updateContactValidator, runValidation, updateContact);
router.delete('/:id', deleteContact);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: User contacts
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Phone number already used
 *
 *   get:
 *     summary: Get all contacts of logged-in user
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *
 *   patch:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+987654321"
 *     responses:
 *       200:
 *         description: Contact updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       204:
 *         description: Contact deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
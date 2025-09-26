const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');

// Validation rules
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// Public routes
router.post('/submit', contactValidation, contactController.submitContact);

// Admin routes (protected - add your auth middleware)
router.get('/admin/contacts', contactController.getContacts);
router.get('/admin/contacts/stats', contactController.getContactStats);
router.get('/admin/contacts/:id', contactController.getContactById);
router.put('/admin/contacts/:id/status', contactController.updateContactStatus);
router.delete('/admin/contacts/:id', contactController.deleteContact);

module.exports = router;
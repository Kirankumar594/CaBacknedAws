const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { login, logout, checkAuth } = require('../controllers/adminController');

router.post('/login', login);
router.post('/logout',auth, logout);
router.get('/check-auth', auth,checkAuth);

module.exports = router;
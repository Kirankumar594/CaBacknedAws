const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { login, logout, checkAuth } = require('../controllers/adminController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', checkAuth);
=======
const auth = require('../middleware/auth')
const { login, logout, checkAuth } = require('../controllers/adminController');

router.post('/login', login);
router.post('/logout',auth, logout);
router.get('/check-auth', auth,checkAuth);
>>>>>>> 4ce8090be7383ff6facda38e1ae323ba0d9df1c9

module.exports = router;
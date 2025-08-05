const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
} = require('../controllers/newsController');

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Protected routes (require admin authentication)
router.post('/', auth, upload.single('image'), createNews);
router.put('/:id', auth, upload.single('image'), updateNews);
router.delete('/:id', auth, deleteNews);

module.exports = router;
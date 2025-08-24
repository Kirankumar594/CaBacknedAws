const News = require('../models/News');
const fs = require('fs');
const path = require('path');

const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
     const image = req.file ? `/uploads/${req.file.filename}` : null;

    const news = new News({
      title,
      content,
      image
    });

    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Handle image update
    let image = news.image;
    if (req.file) {
      // Delete old image if it exists
      if (news.image) {
        fs.unlink(news.image, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      image = req.file.path;
    }

    news.title = title || news.title;
    news.content = content || news.content;
    news.image = image;
    news.updatedAt = Date.now();

    await news.save();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Delete associated image if it exists
    if (news.image) {
      const imagePath = path.join(__dirname, '..', news.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews
};
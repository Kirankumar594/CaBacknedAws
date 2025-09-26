require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');

const app = express();




// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
connectDB();
const PORT = process.env.PORT;      
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
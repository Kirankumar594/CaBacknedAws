const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if another admin is already logged in
    const loggedInAdmin = await Admin.findOne({ isLoggedIn: true });
    if (loggedInAdmin && loggedInAdmin.username !== username) {
      return res.status(403).json({ error: 'Another admin is already logged in' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Mark admin as logged in
    admin.isLoggedIn = true;
    await admin.save();

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '8h' });

    res.json({ 
      message: 'Logged in successfully',
      token,
      admin: { username: admin.username }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    // Add validation for req.admin
    if (!req.admin || !req.admin._id) {
      return res.status(401).json({ error: 'Admin not authenticated' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    
    admin.isLoggedIn = false;
    await admin.save();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: err.message });
  }
};

// In your adminController.js
const checkAuth = async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided or malformed' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if admin exists and is logged in
    const admin = await Admin.findOne({ 
      _id: decoded._id, 
      isLoggedIn: true 
    });
    
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found or not logged in' });
    }

    // You can attach the admin to the request if needed
    req.admin = admin;

    res.json({ 
      authenticated: true, 
      admin: { 
        id: admin._id, 
        username: admin.username 
      } 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(500).json({ error: 'Authentication check failed' });
  }
};

module.exports = { login, logout, checkAuth };
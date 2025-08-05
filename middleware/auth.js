const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findOne({ _id: decoded._id, isLoggedIn: true });

    if (!admin) {
      throw new Error();
    }

    req.token = token;
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate as admin.' });
  }
};

module.exports = auth;
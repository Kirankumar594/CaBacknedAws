const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Create single admin if none exists
Admin.findOne({})
  .then(admin => {
    if (!admin) {
      const defaultAdmin = new Admin({
        username: 'admin',
        password: 'admin123' // Change this in production!
      });
      defaultAdmin.save();
      console.log('Default admin created');
    }
  })
  .catch(err => console.error('Error checking for admin:', err));

module.exports = Admin;
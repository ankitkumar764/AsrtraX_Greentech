const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'krishisaarthi_secret_key_2024';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      // For some routes, we might allow guest access but still want to check for user
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    // Continue as guest if token is invalid or expired
    next();
  }
};

module.exports = auth;

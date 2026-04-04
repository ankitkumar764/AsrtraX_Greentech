const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'krishisaarthi_secret_key_2024';
const JWT_EXPIRE = '7d';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// ─── POST /api/auth/register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, state } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, state: state || '' });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to KrishiSaarthi 🌱',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        state: user.state,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors)[0].message;
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}! 🌾`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        state: user.state,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ─── GET /api/auth/me (verify token) ──────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
});

module.exports = router;

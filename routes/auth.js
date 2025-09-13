const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Account = require('../models/Account');

// POST /auth/register-or-login
router.post('/register-or-login', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await Account.findOne({ username });

    if (existingUser) {
      // Login flow
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Create session
      req.session.userId = existingUser._id;
      req.session.role = existingUser.role;

      return res.status(200).json({
        message: 'Login successful',
        username: existingUser.username,
        role: existingUser.role
      });
    }

    // Register flow
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Account({
      username,
      password: hashedPassword,
      role: role || 'USER'
    });

    await newUser.save();

    // Create session
    req.session.userId = newUser._id;
    req.session.role = newUser.role;

    return res.status(201).json({
      message: 'User registered successfully',
      username: newUser.username,
      role: newUser.role
    });

  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route - destroy session
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('session-id');
    res.json({ message: 'Logout successful' });
  });
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Protected example route
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await Account.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

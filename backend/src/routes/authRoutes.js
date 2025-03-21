const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1) Check if user exists
    // 2) Hash password
    // 3) Insert into DB
    // 4) Return success or JWT
    res.status(200).json({ message: 'Register endpoint (placeholder)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1) Find user by email
    // 2) Compare hashed password
    // 3) Generate JWT
    // 4) Return token
    res.status(200).json({ message: 'Login endpoint (placeholder)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

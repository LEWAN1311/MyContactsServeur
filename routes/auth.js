const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const users = []; // Replace with DB in production
const SECRET_KEY = process.env.JWT_SECRET || '617a58424fe131083ceda56217baf6bf';

// Register
router.post('/register', async (req, res) => {
    console.log("hello from register");
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
    console.log("hello from login");
  const { username, password } = req.body;
  console.log("username", username);
  console.log("password", password);
  const user = users.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
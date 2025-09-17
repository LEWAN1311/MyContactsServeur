const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const SECRET_KEY = process.env.JWT_SECRET || '617a58424fe131083ceda56217baf6bf';

const registerUser = async (email, password) => {
  if (!email || !password) {
    return { ok: false, status: 400, message: 'Email and password are required' };
  }

  // Try DB first (Mongoose)
  try {
    const existing = await User.findOne({ email: email }).lean();
    if (existing) {
      return { ok: false, status: 409, message: 'Email already exists' };
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email: email, password: hashedPassword, creatAt: new Date() });
    return { ok: true, user };
  } catch (err) {
    return { ok: false, status: 500, message: 'Internal server error' };
  }
}

const authenticateUser = async (email, password) => {
  if (!email || !password) {
    return { ok: false, status: 400, message: 'Email and password are required' };
  }
  try {
    const user = await User.findOne({ email: email }).lean();
    console.log("authenticate user =", user)
    if (!user) return { ok: false, status: 405, message: 'Invalid credentials' };
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { ok: false, status: 405, message: 'Invalid credentials' };
    return { user, ok: true };
  } catch (err) {
    console.error('authenticateUser error:', err);
    return { ok: false, status: 500, message: 'Internal server error' };
  }
}

const generateToken = (user) => {
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
  registerUser,
  authenticateUser,
  generateToken,
};



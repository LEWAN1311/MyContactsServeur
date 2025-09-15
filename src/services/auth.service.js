const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// In-memory users store (fallback). We will prefer DB when available.
const users = [];

const SECRET_KEY = process.env.JWT_SECRET || '617a58424fe131083ceda56217baf6bf';

const registerUser = async (username, password) => {
  if (!username || !password) {
    return { ok: false, status: 400, message: 'Username and password are required' };
  }

  // Try DB first (Mongoose)
  try {
    const existing = await User.findOne({ email: username }).lean();
    if (existing) {
      return { ok: false, status: 409, message: 'Username already exists' };
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email: username, password: hashedPassword, creatAt: new Date() });
    return { ok: true };
  } catch (err) {
    // Fallback to in-memory if DB not available
    const exists = users.find((u) => u.email === username);
    if (exists) {
      return { ok: false, status: 409, message: 'Username already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = { ...User };
    userObj.email = username;
    userObj.password = hashedPassword;
    userObj.creatAt = new Date();
    users.push(userObj);
    return { ok: true };
  }
}

const authenticateUser = async (username, password) => {
  if (!username || !password) {
    return { ok: false, status: 400, message: 'Username and password are required' };
  }
  try {
    const user = await User.findOne({ email: username }).lean();
    console.log("authenticate user =", user)
    if (!user) return { ok: false, status: 401, message: 'Invalid credentials' };
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { ok: false, status: 401, message: 'Invalid credentials' };
    return { user, ok: true };
  } catch (err) {
    // Fallback to in-memory if DB not available
    const user = users.find((u) => u.email === username);
    if (!user) return { ok: false, status: 401, message: 'Invalid credentials' };
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { ok: false, status: 401, message: 'Invalid credentials' };
    return { ok: true };
  }
}

const generateToken = (user) => {
  return jwt.sign({ user }, SECRET_KEY);
}

module.exports = {
  registerUser,
  authenticateUser,
  generateToken,
};



const { registerUser, authenticateUser, generateToken } = require('../services/auth.service');

/**
 * Handle user registration
 */
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await registerUser(username, password);
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    return res.status(201).json({ message: 'User registered' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Handle user login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authenticateUser(username, password);
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    const user = result.user
    const token = generateToken(user);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
};



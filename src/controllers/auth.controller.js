const { registerUser, authenticateUser, generateToken, logoutUser } = require('../services/auth.service');

/**
 * Handle user registration
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
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
    const { email, password } = req.body;
    const result = await authenticateUser(email, password);
    if (!result.ok) return res.status(result.status).json({ message: result.message });
    const user = result.user
    const token = generateToken(user);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Handle user logout
 */
const logout = async (req, res) => {
  try {
    // Récupérer l'ID utilisateur depuis le token JWT (déjà vérifié par le middleware auth)
    const userId = req.user.user._id;
    
    const result = await logoutUser(userId);
    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }
    
    return res.json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  logout,
};



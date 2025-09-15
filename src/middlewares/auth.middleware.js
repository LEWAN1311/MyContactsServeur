const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || '617a58424fe131083ceda56217baf6bf';

const requireAuth = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        console.log("verify user =", user)
        req.user = user;
        next();
    });
};

module.exports = requireAuth;
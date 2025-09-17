const jwt = require('jsonwebtoken');
const requireAuth = require('../../src/middlewares/auth.middleware');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Token Validation', () => {
    it('should call next() for valid token', () => {
      const user = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;

      requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.user).toEqual(user);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 for missing token', () => {
      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for missing Authorization header', () => {
      req.headers = {};

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 for invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for expired token', () => {
      const user = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '-1h' }); // Expired token
      
      req.headers.authorization = `Bearer ${token}`;

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle token with wrong secret', () => {
      const user = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      const token = jwt.sign({ user }, 'wrong-secret');
      
      req.headers.authorization = `Bearer ${token}`;

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Token Format', () => {
    it('should handle Bearer token format', () => {
      const user = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;

      requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.user).toEqual(user);
    });

    it('should handle token without Bearer prefix', () => {
      const user = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      
      req.headers.authorization = token;

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'No token provided'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle malformed Authorization header', () => {
      req.headers.authorization = 'InvalidFormat token';

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('User Object Structure', () => {
    it('should preserve user object structure', () => {
      const user = { 
        _id: '507f1f77bcf86cd799439011', 
        email: 'test@example.com',
        creatAt: new Date()
      };
      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      
      req.headers.authorization = `Bearer ${token}`;

      requireAuth(req, res, next);

      expect(req.user.user._id).toBe(user._id);
      expect(req.user.user.email).toBe(user.email);
      expect(req.user.user.creatAt).toBeDefined();
    });
  });
});

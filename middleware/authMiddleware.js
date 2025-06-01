const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

exports.authorizePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('role');

      if (!user || !user.role) {
        return res.status(403).json({ message: 'No role assigned' });
      }

      if (!user.role.permissions.includes(permission)) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Permission check failed', error });
    }
  };
};
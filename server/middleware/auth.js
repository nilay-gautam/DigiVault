import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'securedoc_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired vault token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator privileges required.' });
  }
};

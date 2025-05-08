const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Only send what is needed
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const adminAuth = (req, res, next) => {
  // Get token from header, expects "Bearer <token>"
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    // Check if the user has the 'admin' role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Requires admin role' });
    }

    req.user = decoded; // Attach decoded user info to the request object
    next();
  });
};

module.exports = adminAuth;
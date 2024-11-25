// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require(dotenv).coniig();

// Authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: err.message });
    req.user = user;
    next();
  });
};




// Check user role
const authorizeRole = (role) => {
  return (req, res, next,err) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: err.message});
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
// module.exports = { authenticateToken};
    
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'book000';

const verifyToken = (req, res, next) => 
{
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Decode the token
    req.user = decoded; // Attach user details (email, userId) to the request
    next(); // Proceed to the dashboard controller
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;

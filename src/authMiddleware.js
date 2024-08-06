// src/authMiddleware.js

const jwt = require('jsonwebtoken');

// Replace 'your_jwt_secret' with your actual JWT secret key
const JWT_SECRET = 'f85b34d96a0cd74d487d04a036b27243';

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).send('Access denied.');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Forbidden.');
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;

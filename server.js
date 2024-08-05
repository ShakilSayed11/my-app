const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3000;

// MongoDB setup
const uri = process.env.SUPABASE_DB_URL;
const client = new MongoClient(uri);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Route to serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route to serve admin page
app.get('/admin', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Route to serve main content
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Check credentials
  const db = client.db('app');
  const users = db.collection('users');
  const user = await users.findOne({ username, password });
  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

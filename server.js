const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();

// Initialize Supabase
const supabase = createClient(
  'https://dwcbvbpwkfmydeucsydj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI'
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Login Route
app.get('/login', (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/');
  } else {
    res.render('login'); // Render login page
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Query Supabase to verify user credentials
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data || !(await bcrypt.compare(password, data.password))) {
    return res.status(401).send('Invalid credentials');
  }

  // Store user session
  req.session.isLoggedIn = true;
  req.session.username = username;
  req.session.isAdmin = data.role === 'admin';

  res.redirect('/');
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.redirect('/login');
  });
});

// Main Page Route
app.get('/', (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('index'); // Render the main page with navigation
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
  }
});

// Handle other routes
app.get('/productivity-form', (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('productivity-form'); // Render productivity form page
  } else {
    res.redirect('/login');
  }
});

app.get('/tag-my-breaks', (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('tag-my-breaks'); // Render tag my breaks page
  } else {
    res.redirect('/login');
  }
});

app.get('/inform-outage', (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('inform-outage'); // Render inform outage page
  } else {
    res.redirect('/login');
  }
});

// Admin Page Route
app.get('/admin', (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin) {
    res.render('admin-users'); // Render admin page
  } else {
    res.redirect('/login');
  }
});

app.post('/admin/add-user', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into Supabase
    const { error } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword, role }]);

    if (error) {
      throw error;
    }

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

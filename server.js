const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error || !users) return res.status(401).json({ message: 'Invalid credentials' });
  
  const isMatch = await bcrypt.compare(password, users.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
  const accessToken = jwt.sign({ username: users.username, role: users.role }, process.env.JWT_SECRET);
  res.cookie('token', accessToken, { httpOnly: true });
  res.json({ message: 'Logged in successfully' });
});

// Route to handle user creation (Admin only)
app.post('/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);

  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, role }]);

  if (error) return res.status(500).json({ message: 'Error creating user' });

  res.json({ message: 'User created successfully' });
});

// Serve the admin user management page
app.get('/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.sendFile(__dirname + '/admin-users.html');
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render the admin user management page
app.get('/admin/users', (req, res) => {
  res.sendFile(__dirname + '/views/admin-users.html');
});

// Route to create a new user
app.post('/admin/users/create', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.redirect('/admin/users');
  } else {
    res.status(400).send('Username and password are required.');
  }
});

// Route to list all users (for admin)
app.get('/admin/users/list', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Other routes...

app.listen(3000, () => console.log('Server running on port 3000'));

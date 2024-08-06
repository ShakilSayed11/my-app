const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('@supabase/supabase-js').createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');
const JWT_SECRET = 'f85b34d96a0cd74d487d04a036b27243';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const { data, error } = await supabase
    .from('user_credentials')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) return res.status(400).send('Invalid credentials.');

  const isMatch = bcrypt.compareSync(password, data.password_hash);

  if (!isMatch) return res.status(400).send('Invalid credentials.');

  const token = jwt.sign({
    username: data.username,
    roles: data.roles,
  }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;

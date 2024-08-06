const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

// Initialize Supabase client
const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Attempting to log in user:', username);

    try {
        // Fetch user from Supabase
        const { data, error } = await supabase
            .from('user_credentials')
            .select('*')
            .eq('username', username)
            .single(); // Ensure you only get one result

        console.log('Data fetched from Supabase:', data);
        console.log('Error:', error);

        if (error) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        if (!data) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare password with hash
        const isMatch = await bcrypt.compare(password, data.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ username: data.username, role: data.roles[0] }, 'f85b34d96a0cd74d487d04a036b27243', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

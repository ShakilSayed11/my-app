const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000; // Ensure port matches the deployment

// Supabase client setup
const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the Supabase table
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, 'f85b34d96a0cd74d487d04a036b27243', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

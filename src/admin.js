const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjg1NDY1MywiZXhwIjoyMDM4NDMwNjUzfQ.51c7anMSPbGU6MGpzUbJZz9rhorFNOFOxUCizY62l7M');

app.use(bodyParser.json());

app.post('/add-user', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('user_credentials')
            .insert([{ username, password_hash: hashedPassword, roles: ['user'] }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: 'User created successfully', data });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.listen(port, () => {
    console.log(`Admin service running on port ${port}`);
});

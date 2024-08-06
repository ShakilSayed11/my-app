const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 10000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !data) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, data.password_hash);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: data.username, role: data.roles[0] }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login successful' });
});

app.post('/add-user', authenticateJWT, async (req, res) => {
    const { username, password } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

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

app.get('/dashboard', authenticateJWT, (req, res) => {
    const role = req.user.role;
    if (role === 'admin') {
        res.redirect('/admin');
    } else if (role === 'user') {
        res.sendFile(path.join(__dirname, '../public/generic-dashboard.html'));
    } else {
        res.status(403).send('Access denied');
    }
});

app.get('/admin', authenticateJWT, (req, res) => {
    if (req.user.role === 'admin') {
        res.sendFile(path.join(__dirname, '../public/admin.html'));
    } else {
        res.status(403).send('Access denied');
    }
});

// Catch-All Route
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

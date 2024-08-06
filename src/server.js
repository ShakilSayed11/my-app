const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 10000;

const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'YOUR_SUPABASE_KEY');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware for checking JWT and setting user role
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, 'YOUR_JWT_SECRET', (err, user) => {
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

// Root route to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('user_credentials')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        if (!data) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, data.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: data.username, role: data.roles[0] }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add user route
app.post('/add-user', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

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
        res.status(500).json({ error: 'Server error' });
    }
});

// Load users route
app.get('/api/users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { data, error } = await supabase.from('user_credentials').select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user route
app.post('/api/update-user', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { id, username, roles } = req.body;

    try {
        const { data, error } = await supabase
            .from('user_credentials')
            .update({ username, roles })
            .match({ id });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'User updated successfully', data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete users route
app.post('/api/delete-users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { ids } = req.body;

    try {
        const { data, error } = await supabase
            .from('user_credentials')
            .delete()
            .in('id', ids);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Users deleted successfully', data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// SQL query execution route
app.post('/api/run-query', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { query } = req.body;

    try {
        const { data, error } = await supabase.rpc('run_query', { query });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin route
app.get('/admin', authenticateJWT, (req, res) => {
    if (req.user.role === 'admin') {
        res.sendFile(path.join(__dirname, '../public/admin.html'));
    } else {
        res.status(403).send('Access denied');
    }
});

// Dashboard route
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 10000;

const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjg1NDY1MywiZXhwIjoyMDM4NDMwNjUzfQ.51c7anMSPbGU6MGpzUbJZz9rhorFNOFOxUCizY62l7M');
const jwtSecret = 'f85b34d96a0cd74d487d04a036b27243';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware for checking JWT and setting user role
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.sendStatus(403);
            }
            req.user = user;
            console.log('JWT verified:', req.user);
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`Attempting to log in user: ${username}`);

    try {
        const { data, error } = await supabase
            .from('user_credentials')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        if (!data) {
            console.error('No user found');
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        console.log('User fetched from database:', data);

        const isMatch = await bcrypt.compare(password, data.password_hash);

        console.log(`Password match: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Assuming roles is a JSON array, parse it
        const roles = JSON.parse(data.roles);

        // Create JWT token with role
        const token = jwt.sign({ username: data.username, role: roles[0] }, jwtSecret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
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

// Fetch all users for the admin dashboard
app.get('/fetch-users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { data, error } = await supabase
            .from('user_credentials')
            .select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Edit user details
app.post('/edit-user', authenticateJWT, async (req, res) => {
    const { id, username, password } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const updates = { username };
        if (password) {
            updates.password_hash = await bcrypt.hash(password, 10);
        }

        const { data, error } = await supabase
            .from('user_credentials')
            .update(updates)
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'User updated successfully', data });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
app.post('/delete-user', authenticateJWT, async (req, res) => {
    const { id } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { data, error } = await supabase
            .from('user_credentials')
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'User deleted successfully', data });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// SQL editor route
app.post('/run-query', authenticateJWT, async (req, res) => {
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
        console.error('Error running query:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/dashboard', authenticateJWT, (req, res) => {
    const role = req.user.role;

    if (role === 'admin') {
        console.log('Redirecting admin user');
        res.redirect('/admin');
    } else if (role === 'user') {
        console.log('Redirecting generic user');
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// Serve the productivity form page
app.get('/productivity-form', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/productivity-form.html'));
});

// Handle data submission from the productivity form
app.post('/submit-productivity', authenticateJWT, async (req, res) => {
    const { agentName, workingDepartment, workingRegion, ticketNumber, taskDate, emailTime, task, timeTaken, taskDetails } = req.body;

    try {
        const { error } = await supabase
            .from('productivity_data') // Adjust table name if needed
            .insert([{ 
                agent_name: agentName,
                working_department: workingDepartment,
                working_region: workingRegion,
                ticket_number: ticketNumber,
                task_date: taskDate,
                email_time: emailTime,
                task,
                time_taken: timeTaken,
                task_details: taskDetails
            }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Productivity data submitted successfully' });
    } catch (err) {
        console.error('Error submitting data:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add this route to serve the productivity form
app.get('/productivity-form', authenticateJWT, (req, res) => {
    if (req.user.role === 'user') {
        res.sendFile(path.join(__dirname, '../public/productivity-form.html'));
    } else {
        res.status(403).send('Access denied');
    }
});


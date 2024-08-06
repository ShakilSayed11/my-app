const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabase = createClient(
    'https://dwcbvbpwkfmydeucsydj.supabase.co',
    'const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabase = createClient(
    'https://dwcbvbpwkfmydeucsydj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI'
);

// Admin user credentials
const adminUser = {
    username: 'admin',
    password: 'adminpassword', // Change this to a secure password
    roles: ['admin']
};

const createAdminUser = async () => {
    try {
        // Hash the admin password
        const hashedPassword = await bcrypt.hash(adminUser.password, 10);

        // Insert admin user into Supabase
        const { data, error } = await supabase
            .from('user_credentials')
            .insert([{ username: adminUser.username, password_hash: hashedPassword, roles: adminUser.roles }]);

        if (error) {
            throw error;
        }

        console.log('Admin user created successfully:', data);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminUser();
'
);

// Admin user credentials
const adminUser = {
    username: 'admin',
    password: 'adminpassword', // Change this to a secure password
    roles: ['admin']
};

const createAdminUser = async () => {
    try {
        // Hash the admin password
        const hashedPassword = await bcrypt.hash(adminUser.password, 10);

        // Insert admin user into Supabase
        const { data, error } = await supabase
            .from('user_credentials')
            .insert([{ username: adminUser.username, password_hash: hashedPassword, roles: adminUser.roles }]);

        if (error) {
            throw error;
        }

        console.log('Admin user created successfully:', data);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminUser();

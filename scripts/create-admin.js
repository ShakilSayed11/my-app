const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjg1NDY1MywiZXhwIjoyMDM4NDMwNjUzfQ.51c7anMSPbGU6MGpzUbJZz9rhorFNOFOxUCizY62l7M');

const createAdmin = async () => {
    const username = 'admin'; // Change this as needed
    const password = 'adminpassword'; // Change this as needed

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('user_credentials')
        .insert([{ username, password_hash: hashedPassword, roles: ['admin'] }]);

    if (error) {
        console.error('Error creating admin user:', error);
    } else {
        console.log('Admin user created successfully:', data);
    }
};

createAdmin();

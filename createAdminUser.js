const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with the service role key
const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

async function createAdminUser() {
  const username = 'admin_username'; // Change to the desired admin username
  const email = 'admin_email@example.com'; // Change to the admin email
  const password = 'admin_password'; // Change to the desired admin password
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from('users')
    .insert([{ username, email, password: hashedPassword, role: 'admin' }]);

  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created successfully');
  }
}

module.exports = createAdminUser;

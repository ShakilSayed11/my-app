const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with the service role key
const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

async function createAdminUser() {
  const username = 'admin_username'; // Change to the desired admin username
  const password = 'admin_password'; // Change to the desired admin password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Disable RLS
  await supabase.rpc('enable_rls', { table_name: 'users', enable: false });

  const { error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, role: 'admin' }]);

  // Re-enable RLS
  await supabase.rpc('enable_rls', { table_name: 'users', enable: true });

  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created successfully');
  }
}

createAdminUser();

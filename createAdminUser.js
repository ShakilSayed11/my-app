const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://dwcbvbpwkfmydeucsydj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI');

async function createAdminUser() {
  const username = 'admin';
  const password = 'admin_password';
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, role: 'admin' }]);

  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created successfully');
  }
}

createAdminUser();

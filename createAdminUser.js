const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with the service role key
const supabaseUrl = 'https://dwcbvbpwkfmydeucsydj.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjg1NDY1MywiZXhwIjoyMDM4NDMwNjUzfQ.51c7anMSPbGU6MGpzUbJZz9rhorFNOFOxUCizY62l7M';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createAdminUser() {
  const username = 'sayed'; // Change to the desired admin username
  const password = '1530'; // Change to the desired admin password
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, role: 'admin' }]);

  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created successfully', data);
  }
}

createAdminUser();

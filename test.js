const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with the anon key
const supabaseUrl = 'https://dwcbvbpwkfmydeucsydj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const username = 'sayed'; // Change to the username you are testing

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  console.log('Supabase response:', { data, error });
}

testQuery();

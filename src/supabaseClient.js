// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dwcbvbpwkfmydeucsydj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2J2YnB3a2ZteWRldWNzeWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTQ2NTMsImV4cCI6MjAzODQzMDY1M30.g688zmPnGmwu9oBt7YrfUmtivDohDyiEYPQP-lz16GI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://golxpcnucjlhpbtyblfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbHhwY251Y2psaHBidHlibGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NTI4MjksImV4cCI6MjA1MDQyODgyOX0.o5JUEtpBb6FSjLK27NAap0erCzHWubudJ7CvfhDDUFw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
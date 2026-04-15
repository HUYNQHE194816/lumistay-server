const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Kiểm tra nhanh xem cấu hình có đủ không
if (!supabaseUrl || !supabaseKey) {
  console.log("❌ Thiếu URL hoặc Key của Supabase trong file .env");
} else {
  console.log("⚡ Supabase Client initialized!");
}

module.exports = supabase;
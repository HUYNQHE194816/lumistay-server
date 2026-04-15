const app = require('./src/app');
// Import file cấu hình supabase để kiểm tra kết nối
require('./src/config/supabase'); 

const PORT = process.env.PORT || 5000;

// Chạy server luôn mà không cần hàm connectDB của mongoose
app.listen(PORT, () => {
  console.log(`🚀 LumiStay Server running on: http://localhost:${PORT}`);
});
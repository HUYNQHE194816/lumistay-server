const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Không tìm thấy Token. Vui lòng đăng nhập!" });
  }

  try {
    // Supabase tự động kiểm tra tính hợp lệ của JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Phiên đăng nhập hết hạn hoặc Token không hợp lệ" });
    }

    // Lưu thông tin user vào request để các controller phía sau sử dụng
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Xác thực thất bại" });
  }
};

module.exports = { protect };
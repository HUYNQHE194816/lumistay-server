const supabase = require('../config/supabase');

// API này sẽ được gọi sau khi Frontend đăng nhập Google thành công
exports.googleLoginSync = async (req, res) => {
  const { user } = req.body; // Thông tin user từ Supabase gửi sang

  try {
    // 1. Kiểm tra xem user này đã có trong bảng profiles chưa
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // 2. Nếu chưa có (người mới), hãy tạo profile cho họ
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            full_name: user.user_metadata.full_name, 
            avatar_url: user.user_metadata.avatar_url,
            role: 'student' // Mặc định là sinh viên
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return res.status(201).json({ message: "Chào mừng thành viên mới!", profile: newProfile });
    }

    // 3. Nếu có rồi thì trả về thông tin cũ
    res.status(200).json({ message: "Đăng nhập thành công!", profile });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
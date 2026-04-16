const supabase = require('../config/supabase');

exports.googleSync = async (req, res) => {
  // Frontend sẽ gửi thông tin user lấy từ Supabase sau khi login Google thành công
  const { id, email, user_metadata } = req.body; 

  try {
    // 1. Kiểm tra xem profile đã tồn tại chưa
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 là lỗi không tìm thấy dòng nào
      throw fetchError;
    }

    // 2. Nếu chưa có profile (lần đầu đăng nhập), hãy tạo mới
    if (!existingProfile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: id, 
            full_name: user_metadata.full_name, 
            avatar_url: user_metadata.avatar_url,
            role: 'student' // Mặc định là sinh viên, chủ trọ sẽ cập nhật sau
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return res.status(201).json({ message: "Tạo profile mới thành công", profile: newProfile });
    }

    // 3. Nếu đã có, trả về thông tin hiện tại
    res.status(200).json({ message: "Đăng nhập thành công", profile: existingProfile });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
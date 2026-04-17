const supabase = require('../config/supabase');

/**
 * Lấy danh sách phòng trọ đang hiển thị, có phân trang.
 * @param {number} page - Trang hiện tại (mặc định 1)
 * @param {number} limit - Số phòng mỗi trang (mặc định 10)
 * @returns {object} { rooms, page, limit, total, totalPages }
 */
exports.fetchAllRooms = async (page = 1, limit = 10) => {
  // Tính offset cho phân trang
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 1. Đếm tổng số phòng đang hiển thị
  const { count, error: countError } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('is_visible', true);

  if (countError) throw countError;

  // 2. Lấy danh sách phòng theo phân trang, sắp xếp mới nhất trước
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    rooms,
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
};

/**
 * Lấy danh sách phòng xung quanh một tọa độ (Sử dụng hàm RPC của PostGIS trong Supabase).
 * @param {number} lat - Vĩ độ
 * @param {number} lng - Kinh độ
 * @param {number} radius - Bán kính tìm kiếm (mét)
 */
exports.fetchRoomsNearby = async (lat, lng, radius) => {
  // Goi function 'find_nearby_rooms' đã được tạo trong Database (xem file SQL hướng dẫn)
  const { data, error } = await supabase.rpc('find_nearby_rooms', {
    user_lat: parseFloat(lat),
    user_lon: parseFloat(lng),
    max_distance_meters: parseFloat(radius)
  });

  if (error) throw error;
  return data;
};

/**
 * Tạo phòng trọ mới.
 * @param {object} roomData - Dữ liệu phòng từ request body
 * @param {string} userId - ID của người đăng
 * @returns {object} Phòng vừa tạo
 */
exports.createNewRoom = async (roomData, userId) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([{ ...roomData, owner_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Lấy danh sách phòng của chính chủ.
 * @param {string} userId - ID của chủ phòng
 */
exports.fetchRoomsByOwner = async (userId) => {
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return rooms;
};

/**
 * Lấy chi tiết một phòng trọ theo ID.
 */
exports.getRoomById = async (roomId) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Cập nhật thông tin phòng trọ.
 * Chỉ chủ phòng (owner_id) mới được cập nhật.
 */
exports.updateRoom = async (roomId, roomData, userId) => {
  // roomData có thể chứa is_visible để ẩn/hiện phòng
  const { data, error } = await supabase
    .from('rooms')
    .update({ ...roomData, updated_at: new Date() })
    .eq('id', roomId)
    .eq('owner_id', userId) // Đảm bảo chỉ owner mới update được
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Phòng không tồn tại hoặc bạn không có quyền chỉnh sửa!");
  return data;
};

/**
 * Xóa phòng trọ.
 * Chỉ chủ phòng mới được xóa.
 */
exports.deleteRoom = async (roomId, userId) => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)
    .eq('owner_id', userId);

  if (error) throw error;
  return true;
};

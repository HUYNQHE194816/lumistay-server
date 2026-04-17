const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Điểm lưu ý: route tĩnh thường được đặt trước các route có chứa /:id
router.get('/', roomController.getAllRooms);
router.get('/nearby', roomController.getRoomsNearby);
router.get('/my-rooms', protect, authorize('landlord'), roomController.getMyRooms);
router.get('/:id', roomController.getRoomById);

// Nhóm chức năng dành cho Chủ trọ (landlord)
router.post('/', protect, authorize('landlord'), roomController.createRoom);
router.put('/:id', protect, authorize('landlord'), roomController.updateRoom);
router.delete('/:id', protect, authorize('landlord'), roomController.deleteRoom);

module.exports = router;
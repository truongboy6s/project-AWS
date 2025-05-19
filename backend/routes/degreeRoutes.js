const express = require('express');
const router = express.Router();
const degreeController = require('../controllers/degreeController');

// Route lấy tất cả học vị
router.get('/', degreeController.getAllDegrees);

// Route lấy học vị theo ID
router.get('/:id', degreeController.getDegreeById);

// Route tạo học vị mới
router.post('/', degreeController.createDegree);

// Route cập nhật học vị
router.put('/:id', degreeController.updateDegree);

// Route xóa học vị
router.delete('/:id', degreeController.deleteDegree);

module.exports = router;

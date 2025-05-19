const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Route lấy tất cả giảng viên
router.get('/', teacherController.getAllTeachers);

// Route lấy thống kê giảng viên
router.get('/statistics', teacherController.getTeacherStatistics);

// Route lấy giảng viên theo ID
router.get('/:id', teacherController.getTeacherById);

// Route tạo giảng viên mới
router.post('/', teacherController.createTeacher);

// Route cập nhật giảng viên
router.put('/:id', teacherController.updateTeacher);

// Route xóa giảng viên
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;

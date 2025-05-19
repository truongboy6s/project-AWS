const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Route lấy tất cả khoa
router.get('/', departmentController.getAllDepartments);

// Route lấy khoa theo ID
router.get('/:id', departmentController.getDepartmentById);

// Route tạo khoa mới
router.post('/', departmentController.createDepartment);

// Route cập nhật khoa
router.put('/:id', departmentController.updateDepartment);

// Route xóa khoa
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;

const express = require('express');
const Test = require('../models/Test');

const router = express.Router();

// Route để kiểm tra kết nối MongoDB bằng cách tạo một bản ghi mới
router.post('/create-test', async (req, res) => {
  try {
    const test = new Test({
      name: req.body.name || 'Test Connection ' + new Date().toISOString()
    });
    const savedTest = await test.save();
    res.status(201).json({
      success: true,
      message: 'Kết nối MongoDB thành công và tạo bản ghi thành công',
      data: savedTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bản ghi',
      error: error.message
    });
  }
});

// Route để lấy tất cả bản ghi test
router.get('/get-all-tests', async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu',
      error: error.message
    });
  }
});

module.exports = router;
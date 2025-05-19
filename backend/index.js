require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Import routes
const degreeRoutes = require('./routes/degreeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

// Middleware: CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true, // nếu frontend cần gửi cookie hoặc token
}));

// Middleware: Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
console.log('🔄 Đang kết nối với MongoDB...');
console.log(`📄 URL kết nối: ${config.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('✅ MongoDB đã kết nối thành công'))
  .catch(err => {
    console.error('❌ MongoDB lỗi kết nối:', err);
    console.log('\n🛠️ Hướng dẫn khắc phục:');
    console.log('1. Kiểm tra xem MongoDB đã được cài đặt và đang chạy chưa');
    console.log('2. Kiểm tra URL kết nối MongoDB trong file config.js');
    console.log('3. Đảm bảo username, password và URL cluster đã được cấu hình đúng');
    console.log('4. Kiểm tra kết nối mạng và tường lửa\n');
    process.exit(1); // dừng server nếu kết nối thất bại
  });

// Kiểm tra API gốc
app.get('/', (req, res) => {
  res.send('🚀 API Quản lý Giảng viên đang hoạt động!');
});

// Mount API routes
app.use('/api/degrees', degreeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teachers', teacherRoutes);

// Middleware: Error handler
app.use((err, req, res, next) => {
  console.error('❌ Lỗi server:', err.stack);
  res.status(500).json({
    message: 'Có lỗi xảy ra!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

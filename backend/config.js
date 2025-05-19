module.exports = {
  // URI kết nối MongoDB - Lấy từ biến môi trường
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/teacher-management',
  
  // Port cho server
  PORT: process.env.PORT || 5000,
  
  // Cấu hình CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Secret key cho JWT (nếu sau này cần thêm authentication)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  
  // Thời gian hết hạn token (nếu sau này cần thêm authentication)
  JWT_EXPIRE: '1d'
};
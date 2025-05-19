import axios from 'axios';

// Cấu hình axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Đường dẫn đến backend API
  timeout: 10000, // Timeout sau 10 giây
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;

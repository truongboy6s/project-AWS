import api from './api';

// CRUD cho giảng viên
export const TeacherService = {
  // Lấy tất cả giảng viên
  getAllTeachers: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },

  // Lấy giảng viên theo ID
  getTeacherById: async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  // Thêm mới giảng viên
  createTeacher: async (teacherData) => {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  },

  // Cập nhật giảng viên
  updateTeacher: async (id, teacherData) => {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  },

  // Xóa giảng viên
  deleteTeacher: async (id) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
  
  // Thống kê giảng viên
  getTeacherStatistics: async () => {
    const response = await api.get('/teachers/statistics');
    return response.data;
  }
};

export default TeacherService;

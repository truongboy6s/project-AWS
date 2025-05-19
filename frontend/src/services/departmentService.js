import api from './api';

// CRUD cho khoa
export const DepartmentService = {
  // Lấy tất cả khoa
  getAllDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  // Lấy khoa theo ID
  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  // Thêm mới khoa
  createDepartment: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  // Cập nhật khoa
  updateDepartment: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
  },

  // Xóa khoa
  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  }
};

export default DepartmentService;

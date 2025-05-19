import api from './api';

// CRUD cho học vị
export const DegreeService = {
  // Lấy tất cả học vị
  getAllDegrees: async () => {
    const response = await api.get('/degrees');
    return response.data;
  },

  // Lấy học vị theo ID
  getDegreeById: async (id) => {
    const response = await api.get(`/degrees/${id}`);
    return response.data;
  },

  // Thêm mới học vị
  createDegree: async (degreeData) => {
    const response = await api.post('/degrees', degreeData);
    return response.data;
  },

  // Cập nhật học vị
  updateDegree: async (id, degreeData) => {
    const response = await api.put(`/degrees/${id}`, degreeData);
    return response.data;
  },

  // Xóa học vị
  deleteDegree: async (id) => {
    const response = await api.delete(`/degrees/${id}`);
    return response.data;
  }
};

export default DegreeService;

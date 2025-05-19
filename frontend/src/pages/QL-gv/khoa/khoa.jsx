import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
import DepartmentService from '../../../services/departmentService';
import '../../../assets/styles/common.css';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({ fullName: '', abbreviation: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch departments from API on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const data = await DepartmentService.getAllDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Không thể tải danh sách khoa. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Filter departments based on search
  const filteredDepartments = departments.filter(department => {
    return (
      department.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const handleAdd = () => {
    setCurrentDepartment({ fullName: '', abbreviation: '' });
    setIsEditing(false);
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setCurrentDepartment({...department});
    setIsEditing(true);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDepartmentToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await DepartmentService.deleteDepartment(departmentToDelete);
      setDepartments(departments.filter(dept => dept._id !== departmentToDelete));
      setShowConfirm(false);
      setError(null);
    } catch (err) {
      console.error("Error deleting department:", err);
      setError("Không thể xóa khoa. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
    const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!currentDepartment.fullName.trim()) {
      newErrors.fullName = 'Tên khoa không được để trống';
    }
    
    if (!currentDepartment.abbreviation.trim()) {
      newErrors.abbreviation = 'Tên viết tắt không được để trống';
    }
    
    // Check for duplicate abbreviation
    const isDuplicateAbbr = departments.some(dept => 
      dept.abbreviation.toLowerCase() === currentDepartment.abbreviation.toLowerCase() && 
      (!isEditing || dept._id !== currentDepartment._id)
    );
    
    if (isDuplicateAbbr) {
      newErrors.abbreviation = 'Tên viết tắt đã tồn tại';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditing) {
        // Update existing department
        const updatedDepartment = await DepartmentService.updateDepartment(currentDepartment._id, currentDepartment);
        setDepartments(departments.map(dept => 
          dept._id === currentDepartment._id ? updatedDepartment : dept
        ));
      } else {
        // Create new department
        const newDepartment = await DepartmentService.createDepartment(currentDepartment);
        setDepartments([...departments, newDepartment]);
      }
      
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving department:", err);
      setError(isEditing ? "Không thể cập nhật thông tin khoa" : "Không thể thêm khoa mới");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartment({
      ...currentDepartment,
      [name]: value
    });
    
    // Clear the specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Khoa</h2>
        <button className="btn-add" onClick={handleAdd}>
          <FaPlus /> Thêm khoa
        </button>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khoa hoặc tên viết tắt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn-clear-search" onClick={() => setSearchTerm('')}>
                ×
              </button>
            )}
          </div>
        </div>
      </div>      {/* Results count */}
      <div className="results-count">
        {filteredDepartments.length > 0 ? (
          <p>Hiển thị {filteredDepartments.length} khoa {filteredDepartments.length < departments.length ? `(trên tổng số ${departments.length})` : ''}</p>
        ) : (
          <p>Không tìm thấy khoa nào phù hợp</p>
        )}
      </div>

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => setError(null)} className="btn-close">×</button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên đầy đủ</th>
                <th>Tên viết tắt</th>
                <th>Thao tác</th>
              </tr>
            </thead>            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr key={department._id}>
                    <td>{department.fullName}</td>
                    <td>{department.abbreviation}</td>
                    <td className="actions">
                      <button className="btn-edit" onClick={() => handleEdit(department)} title="Sửa">
                        Sửa<FaEdit />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(department._id)} title="Xóa">
                        Xóa<FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    {searchTerm ? "Không có dữ liệu phù hợp" : "Chưa có khoa nào trong hệ thống"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{isEditing ? 'Sửa khoa' : 'Thêm khoa'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên đầy đủ:</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={currentDepartment.fullName} 
                  onChange={handleChange} 
                  required 
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label>Tên viết tắt:</label>
                <input 
                  type="text" 
                  name="abbreviation" 
                  value={currentDepartment.abbreviation} 
                  onChange={handleChange} 
                  required 
                />
                {errors.abbreviation && <span className="error-message">{errors.abbreviation}</span>}
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-save">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal modal-confirm">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa khoa này?</p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Hủy</button>
              <button className="btn-delete" onClick={confirmDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
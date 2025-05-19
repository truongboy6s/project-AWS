import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
import DegreeService from '../../../services/degreeService';
import '../../../assets/styles/common.css';

const DegreeManagement = () => {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentDegree, setCurrentDegree] = useState({ name: '', coefficient: '', specialization: '', issueDate: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [degreeToDelete, setDegreeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch degrees from API on component mount
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        setLoading(true);
        const data = await DegreeService.getAllDegrees();
        setDegrees(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching degrees:", err);
        setError("Không thể tải dữ liệu học vị. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDegrees();
  }, []);

  // Filter degrees based on search
  const filteredDegrees = degrees.filter(degree => {
    return (
      degree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      degree.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(degree.coefficient).includes(searchTerm)
    );
  });

  const handleAdd = () => {
    setCurrentDegree({ name: '', coefficient: '', specialization: '', issueDate: '' });
    setIsEditing(false);
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (degree) => {
    // Ensure date is in YYYY-MM-DD format for input[type="date"]
    const formattedDegree = {
      ...degree,
      issueDate: new Date(degree.issueDate).toISOString().split('T')[0]
    };
    setCurrentDegree(formattedDegree);
    setIsEditing(true);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDegreeToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await DegreeService.deleteDegree(degreeToDelete);
      setDegrees(degrees.filter(degree => degree._id !== degreeToDelete));
      setShowConfirm(false);
    } catch (err) {
      console.error("Error deleting degree:", err);
      setError("Không thể xóa học vị. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!currentDegree.name.trim()) {
      newErrors.name = 'Tên học vị không được để trống';
    }
    
    if (!currentDegree.coefficient) {
      newErrors.coefficient = 'Hệ số không được để trống';
    } else if (isNaN(currentDegree.coefficient) || Number(currentDegree.coefficient) <= 0) {
      newErrors.coefficient = 'Hệ số phải là số dương';
    }
    
    if (!currentDegree.specialization.trim()) {
      newErrors.specialization = 'Chuyên ngành không được để trống';
    }
    
    if (!currentDegree.issueDate) {
      newErrors.issueDate = 'Ngày cấp không được để trống';
    }
    
    // Check for duplicate name
    const isDuplicateName = degrees.some(deg => 
      deg.name.toLowerCase() === currentDegree.name.toLowerCase() && 
      (!isEditing || deg.id !== currentDegree.id)
    );
    
    if (isDuplicateName) {
      newErrors.name = 'Tên học vị đã tồn tại';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert coefficient to number
    const processedDegree = {
      ...currentDegree,
      coefficient: Number(currentDegree.coefficient)
    };
    
    try {
      setLoading(true);
      
      if (isEditing) {
        // Update existing degree
        const updatedDegree = await DegreeService.updateDegree(currentDegree._id, processedDegree);
        setDegrees(degrees.map(degree => 
          degree._id === currentDegree._id ? updatedDegree : degree
        ));
      } else {
        // Create new degree
        const newDegree = await DegreeService.createDegree(processedDegree);
        setDegrees([...degrees, newDegree]);
      }
      
      setShowModal(false);
    } catch (err) {
      console.error("Error saving degree:", err);
      setError(isEditing ? "Không thể cập nhật học vị" : "Không thể thêm học vị mới");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDegree({
      ...currentDegree,
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
        <h2>Quản lý Học vị</h2>
        <button className="btn-add" onClick={handleAdd}>
          <FaPlus /> Thêm học vị
        </button>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên học vị, hệ số, chuyên ngành..."
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
      </div>

      {/* Results count */}
      <div className="results-count">
        {filteredDegrees.length > 0 ? (
          <p>Hiển thị {filteredDegrees.length} học vị {filteredDegrees.length < degrees.length ? `(trên tổng số ${degrees.length})` : ''}</p>
        ) : (
          <p>Không tìm thấy học vị nào phù hợp</p>
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
                <th>Tên học vị</th>
                <th>Hệ số</th>
                <th>Chuyên ngành</th>
                <th>Ngày cấp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredDegrees.length > 0 ? (
                filteredDegrees.map((degree) => (
                  <tr key={degree._id}>
                    <td>{degree.name}</td>
                    <td>{degree.coefficient}</td>
                    <td>{degree.specialization}</td>
                    <td>{new Date(degree.issueDate).toLocaleDateString('vi-VN')}</td>
                    <td className="actions">
                      <button className="btn-edit" onClick={() => handleEdit(degree)} title="Sửa">
                        Sửa<FaEdit />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(degree._id)} title="Xóa">
                        Xóa<FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    {searchTerm ? "Không có dữ liệu phù hợp" : "Chưa có học vị nào trong hệ thống"}
                  </td>
                </tr>
              )
            }
            </tbody>
          </table>
        )}
      </div>
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{isEditing ? 'Sửa học vị' : 'Thêm học vị'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên học vị:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={currentDegree.name} 
                  onChange={handleChange} 
                  required 
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Hệ số:</label>
                <input 
                  type="number" 
                  step="0.1" 
                  name="coefficient" 
                  value={currentDegree.coefficient} 
                  onChange={handleChange} 
                  required 
                />
                {errors.coefficient && <span className="error-message">{errors.coefficient}</span>}
              </div>
              <div className="form-group">
                <label>Chuyên ngành:</label>
                <input 
                  type="text" 
                  name="specialization" 
                  value={currentDegree.specialization} 
                  onChange={handleChange} 
                  required 
                />
                {errors.specialization && <span className="error-message">{errors.specialization}</span>}
              </div>
              <div className="form-group">
                <label>Ngày cấp:</label>
                <input 
                  type="date" 
                  name="issueDate" 
                  value={currentDegree.issueDate} 
                  onChange={handleChange} 
                  required 
                />
                {errors.issueDate && <span className="error-message">{errors.issueDate}</span>}
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
            <p>Bạn có chắc chắn muốn xóa học vị này?</p>
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

export default DegreeManagement;
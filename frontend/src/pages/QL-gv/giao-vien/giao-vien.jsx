import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import TeacherService from '../../../services/teacherService';
import DepartmentService from '../../../services/departmentService';
import DegreeService from '../../../services/degreeService';
import '../../../assets/styles/common.css';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);  const [currentTeacher, setCurrentTeacher] = useState({
    id: '',
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '', 
    email: '',
    department: '',
    degree: '',
    joinDate: new Date().toISOString().split('T')[0] // Default to today
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherData, departmentData, degreeData] = await Promise.all([
          TeacherService.getAllTeachers(),
          DepartmentService.getAllDepartments(),
          DegreeService.getAllDegrees()
        ]);
        setTeachers(teacherData);
        setDepartments(departmentData);
        setDegrees(degreeData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = searchTerm === '' || 
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phoneNumber.includes(searchTerm);
    
    const matchesDepartment = filterDepartment === '' || teacher.department === filterDepartment;
    const matchesDegree = filterDegree === '' || teacher.degree === filterDegree;
    
    return matchesSearch && matchesDepartment && matchesDegree;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('');
    setFilterDegree('');
  };

  // Count number of teachers in each department
  const getDepartmentCount = (deptCode) => {
    return teachers.filter(t => t.department === deptCode).length;
  };

  // Count number of teachers with each degree
  const getDegreeCount = (degreeName) => {
    return teachers.filter(t => t.degree === degreeName).length;
  };
  const handleAdd = () => {
    setCurrentTeacher({
      id: generateTeacherId(),
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: '',
      degree: '',
      joinDate: new Date().toISOString().split('T')[0] // Default to today
    });
    setIsEditing(false);
    setErrors({});
    setShowModal(true);
  };
  const handleEdit = (teacher) => {
    // Format date for input type='date'
    const formattedTeacher = {
      ...teacher,
      dateOfBirth: new Date(teacher.dateOfBirth).toISOString().split('T')[0],
      joinDate: new Date(teacher.joinDate).toISOString().split('T')[0]
    };
    setCurrentTeacher(formattedTeacher);
    setIsEditing(true);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTeacherToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await TeacherService.deleteTeacher(teacherToDelete);
      setTeachers(teachers.filter(teacher => teacher._id !== teacherToDelete));
      setError(null);
    } catch (error) {
      setError("Không thể xóa giảng viên. Vui lòng thử lại sau.");
      console.error("Error deleting teacher:", error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    // Phone number validation (10 digits)
    if (!/^\d{10}$/.test(currentTeacher.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 10 chữ số';
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentTeacher.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Empty field validation
    if (!currentTeacher.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    
    if (!currentTeacher.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh không được để trống';
    }
    
    if (!currentTeacher.department) {
      newErrors.department = 'Vui lòng chọn khoa';
    }
    
    if (!currentTeacher.degree) {
      newErrors.degree = 'Vui lòng chọn học vị';
    }
    
    if (!currentTeacher.joinDate) {
      newErrors.joinDate = 'Ngày gia nhập không được để trống';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);

      // Create a clean copy of the teacher data without _id
      const teacherData = { 
        id: currentTeacher.id,
        fullName: currentTeacher.fullName,
        dateOfBirth: currentTeacher.dateOfBirth,
        phoneNumber: currentTeacher.phoneNumber,
        email: currentTeacher.email,
        department: currentTeacher.department,
        degree: currentTeacher.degree,
        joinDate: currentTeacher.joinDate || new Date().toISOString().split('T')[0]
      };
      
      if (isEditing) {
        // Get the ID from currentTeacher
        const id = currentTeacher._id;
        
        // Update the teacher
        const updatedTeacher = await TeacherService.updateTeacher(id, teacherData);
        
        // Update local state
        setTeachers(teachers.map(teacher => 
          teacher._id === id ? updatedTeacher : teacher
        ));
        setError(null);
      } else {
        // For new teacher, use createTeacher API
        const newTeacher = await TeacherService.createTeacher(teacherData);
        setTeachers([...teachers, newTeacher]);
        setError(null);
      }
    } catch (error) {
      setError("Không thể lưu dữ liệu giảng viên. Vui lòng thử lại sau.");
      console.error("Error saving teacher:", error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher({
      ...currentTeacher,
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
  const generateTeacherId = () => {
    // Find the highest ID number
    const highestId = teachers.reduce((max, teacher) => {
      // Extract number from ID (GV001 -> 1)
      const idNum = parseInt(teacher.id?.replace('GV', '') || '0');
      return idNum > max ? idNum : max;
    }, 0);
    
    // Create new ID with incremented number
    return `GV${String(highestId + 1).padStart(3, '0')}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Đã xảy ra lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Quản lý Giảng viên</h2>
        <div className="header-actions">
          <button className="btn-filter" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Bộ lọc {showFilters ? '▲' : '▼'}
          </button>
          <button className="btn-add" onClick={handleAdd}>
            <FaPlus /> Thêm giảng viên
          </button>
        </div>
      </div>

      {/* Search and Filter section */}
      {showFilters && (
        <div className="filter-section">
          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã GV, email, số điện thoại..."
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
          
          <div className="filters">
            <div className="filter-group">
              <label>Khoa:</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">Tất cả các khoa</option>                {departments.map(dept => (
                  <option key={dept._id} value={dept.abbreviation}>
                    {dept.fullName} ({getDepartmentCount(dept.abbreviation)})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Học vị:</label>
              <select
                value={filterDegree}
                onChange={(e) => setFilterDegree(e.target.value)}
              >
                <option value="">Tất cả các học vị</option>
                {degrees.map(degree => (
                  <option key={degree._id} value={degree.name}>
                    {degree.name} ({getDegreeCount(degree.name)})
                  </option>
                ))}
              </select>
            </div>
            
            {(filterDepartment || filterDegree || searchTerm) && (
              <button className="btn-reset-filter" onClick={resetFilters}>
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="results-count">
        {filteredTeachers.length > 0 ? (
          <p>Hiển thị {filteredTeachers.length} giảng viên {filteredTeachers.length < teachers.length ? `(trên tổng số ${teachers.length})` : ''}</p>
        ) : (
          <p>Không tìm thấy giảng viên nào phù hợp</p>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã GV</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Khoa</th>
              <th>Học vị</th>
              <th>Thao tác</th>
            </tr>
          </thead>          <tbody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.fullName}</td>
                  <td>{new Date(teacher.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  <td>{teacher.phoneNumber}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.degree}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(teacher)} title="Sửa">
                      Sửa<FaEdit />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(teacher._id)} title="Xóa">
                      Xóa<FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{isEditing ? 'Sửa giảng viên' : 'Thêm giảng viên'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã giảng viên:</label>
                <input 
                  type="text" 
                  name="id" 
                  value={currentTeacher.id} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Họ và tên:</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={currentTeacher.fullName} 
                  onChange={handleChange} 
                  required 
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label>Ngày sinh:</label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={currentTeacher.dateOfBirth} 
                  onChange={handleChange} 
                  required 
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  value={currentTeacher.phoneNumber} 
                  onChange={handleChange} 
                  required 
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  value={currentTeacher.email} 
                  onChange={handleChange} 
                  required 
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Khoa:</label>
                <select 
                  name="department" 
                  value={currentTeacher.department} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Chọn khoa</option>                  {departments.map(dept => (
                    <option key={dept._id} value={dept.abbreviation}>
                      {dept.fullName}
                    </option>
                  ))}
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
              </div>
              <div className="form-group">
                <label>Học vị:</label>
                <select 
                  name="degree" 
                  value={currentTeacher.degree} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Chọn học vị</option>
                  {degrees.map(degree => (
                    <option key={degree._id} value={degree.name}>
                      {degree.name}
                    </option>                  ))}
                </select>
                {errors.degree && <span className="error-message">{errors.degree}</span>}
              </div>
              <div className="form-group">
                <label>Ngày gia nhập:</label>
                <input 
                  type="date" 
                  name="joinDate" 
                  value={currentTeacher.joinDate || ''} 
                  onChange={handleChange} 
                  required 
                />
                {errors.joinDate && <span className="error-message">{errors.joinDate}</span>}
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
            <p>Bạn có chắc chắn muốn xóa giảng viên này?</p>
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

export default TeacherManagement;
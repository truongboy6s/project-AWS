import React, { useState, useEffect } from 'react';
import { FaDownload, FaPrint, FaChartBar, FaUserGraduate, FaFileExport, FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import TeacherService from '../../../services/teacherService';
import DepartmentService from '../../../services/departmentService';
import DegreeService from '../../../services/degreeService';
import '../../../assets/styles/common.css';

const TeacherStatistics = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teachersData, departmentsData, degreesData, statsData] = await Promise.all([
          TeacherService.getAllTeachers(),
          DepartmentService.getAllDepartments(),
          DegreeService.getAllDegrees(),
          TeacherService.getTeacherStatistics()
        ]);
        
        setTeachers(teachersData);
        setDepartments(departmentsData);
        setDegrees(degreesData);
        setStatistics(statsData);
        setError(null);
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải dữ liệu: ' + (error.message || 'Lỗi không xác định'));
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Trạng thái cho modal sửa/xóa
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  
  // Hàm xử lý chỉnh sửa giảng viên
  const handleEdit = (teacher) => {
    // Format date for input type='date'
    const formattedTeacher = {
      ...teacher,
      dateOfBirth: new Date(teacher.dateOfBirth).toISOString().split('T')[0],
      joinDate: new Date(teacher.joinDate).toISOString().split('T')[0]
    };
    setCurrentTeacher(formattedTeacher);
    setShowEditModal(true);
  };

  // Hàm xử lý xóa giảng viên
  const handleDelete = (id) => {
    setTeacherToDelete(id);
    setShowDeleteModal(true);
  };

  // Hàm xác nhận xóa giảng viên
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await TeacherService.deleteTeacher(teacherToDelete);
      
      // Cập nhật danh sách giảng viên sau khi xóa
      setTeachers(teachers.filter(teacher => teacher._id !== teacherToDelete));
      setError(null);
    } catch (error) {
      setError('Không thể xóa giảng viên. Vui lòng thử lại sau.');
      console.error('Error deleting teacher:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Lưu thay đổi giảng viên
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const id = currentTeacher._id;
      
      // Make a copy of teacher data without _id for API
      const teacherData = { ...currentTeacher };
      delete teacherData._id; // Remove _id as it's in the URL
      
      const updatedTeacher = await TeacherService.updateTeacher(id, teacherData);
      
      // Update local state
      setTeachers(teachers.map(teacher => 
        teacher._id === id ? updatedTeacher : teacher
      ));
      setError(null);
    } catch (error) {
      setError('Không thể cập nhật thông tin giảng viên. Vui lòng thử lại sau.');
      console.error('Error updating teacher:', error);
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  // Handle input changes in edit modal
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher({
      ...currentTeacher,
      [name]: value
    });
  };

  // Thêm giảng viên mới
  const handleAddTeacher = () => {
    // Redirect to the Teacher Management page with add modal open
    window.location.href = '/QL-gv/giao-vien?action=add';
  };

  // Get list of years from join dates
  const getJoinYears = () => {
    if (!teachers || teachers.length === 0) return [];
    
    const years = teachers.map(teacher => 
      new Date(teacher.joinDate).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a); // Unique years, sorted descending
  };

  // Lọc giảng viên theo các tiêu chí
  const filteredTeachers = teachers.filter(teacher => {
    const departmentMatch = !departmentFilter || teacher.department === departmentFilter;
    const degreeMatch = !degreeFilter || teacher.degree === degreeFilter;
    const yearMatch = !yearFilter || new Date(teacher.joinDate).getFullYear() === parseInt(yearFilter);
    
    // Return true only if all conditions are met
    return departmentMatch && degreeMatch && yearMatch;
  });

  // Summary statistics functions
  const getDepartmentCount = (deptCode) => {
    return teachers.filter(t => t.department === deptCode).length;
  };

  const getDegreeCount = (degreeName) => {
    return teachers.filter(t => t.degree === degreeName).length;
  };
  
  const getAgeGroups = () => {
    if (!teachers || teachers.length === 0) {
      return { under30: 0, between30And40: 0, between40And50: 0, over50: 0 };
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const under30 = teachers.filter(t => 
      currentYear - new Date(t.dateOfBirth).getFullYear() < 30
    ).length;
    
    const between30And40 = teachers.filter(t => {
      const age = currentYear - new Date(t.dateOfBirth).getFullYear();
      return age >= 30 && age < 40;
    }).length;
    
    const between40And50 = teachers.filter(t => {
      const age = currentYear - new Date(t.dateOfBirth).getFullYear();
      return age >= 40 && age < 50;
    }).length;
    
    const over50 = teachers.filter(t => 
      currentYear - new Date(t.dateOfBirth).getFullYear() >= 50
    ).length;
    
    return { under30, between30And40, between40And50, over50 };
  };
  
  const ageGroups = getAgeGroups();
  
  // Export functions
  const exportToExcel = () => {
    alert('Xuất file Excel sẽ được triển khai sau');
  };
  
  const exportToPDF = () => {
    alert('Xuất file PDF sẽ được triển khai sau');
  };
  
  const printData = () => {
    window.print();
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
        <h2>Thống kê Giảng viên</h2>
        <div className="header-actions">
          <button className="btn-add" onClick={handleAddTeacher}>
            <FaPlus /> Thêm Giảng viên
          </button>
          <button className="btn-action" onClick={exportToExcel} title="Xuất Excel">
            <FaFileExport /> Excel
          </button>
          <button className="btn-action" onClick={exportToPDF} title="Xuất PDF">
            <FaDownload /> PDF
          </button>
          <button className="btn-action" onClick={printData} title="In dữ liệu">
            <FaPrint /> In
          </button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="statistics-summary">
        <div className="summary-card">
          <h3>Tổng số giảng viên</h3>
          <div className="summary-value">{teachers.length}</div>
          <div className="summary-icon"><FaUserGraduate /></div>
        </div>
        
        <div className="summary-section">
          <h3>Theo khoa</h3>
          <div className="summary-list">
            {departments.map(dept => (
              <div key={dept._id} className="summary-item">
                <span>{dept.fullName}:</span>
                <span className="summary-count">{getDepartmentCount(dept.abbreviation)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="summary-section">
          <h3>Theo học vị</h3>
          <div className="summary-list">
            {degrees.map(degree => (
              <div key={degree._id} className="summary-item">
                <span>{degree.name}:</span>
                <span className="summary-count">{getDegreeCount(degree.name)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="summary-section">
          <h3>Theo độ tuổi</h3>
          <div className="summary-list">
            <div className="summary-item">
              <span>Dưới 30 tuổi:</span>
              <span className="summary-count">{ageGroups.under30}</span>
            </div>
            <div className="summary-item">
              <span>30-40 tuổi:</span>
              <span className="summary-count">{ageGroups.between30And40}</span>
            </div>
            <div className="summary-item">
              <span>40-50 tuổi:</span>
              <span className="summary-count">{ageGroups.between40And50}</span>
            </div>
            <div className="summary-item">
              <span>Trên 50 tuổi:</span>
              <span className="summary-count">{ageGroups.over50}</span>
            </div>
          </div>
        </div>

        {/* Show stats from backend if available */}
        {statistics && (
          <div className="summary-section">
            <h3>Thống kê khác</h3>
            <div className="summary-list">
              {statistics.avgAge && (
                <div className="summary-item">
                  <span>Tuổi trung bình:</span>
                  <span className="summary-count">{statistics.avgAge.toFixed(1)} tuổi</span>
                </div>
              )}
              {statistics.avgYearsOfService && (
                <div className="summary-item">
                  <span>Số năm công tác trung bình:</span>
                  <span className="summary-count">{statistics.avgYearsOfService.toFixed(1)} năm</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Section */}
      <div className="filter-section">
        <h3>Lọc giảng viên</h3>
        <div className="filters">
          <div className="filter-group">
            <label>Khoa:</label>
            <select 
              value={departmentFilter} 
              onChange={e => setDepartmentFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept.abbreviation}>
                  {dept.fullName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Học vị:</label>
            <select 
              value={degreeFilter} 
              onChange={e => setDegreeFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {degrees.map(degree => (
                <option key={degree._id} value={degree.name}>
                  {degree.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Năm gia nhập:</label>
            <select 
              value={yearFilter} 
              onChange={e => setYearFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              {getJoinYears().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          {(departmentFilter || degreeFilter || yearFilter) && (
            <button 
              className="btn-reset-filter" 
              onClick={() => {
                setDepartmentFilter('');
                setDegreeFilter('');
                setYearFilter('');
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        {filteredTeachers.length > 0 ? (
          <p>Hiển thị {filteredTeachers.length} giảng viên {filteredTeachers.length < teachers.length ? `(trên tổng số ${teachers.length})` : ''}</p>
        ) : (
          <p>Không tìm thấy giảng viên nào phù hợp</p>
        )}
      </div>
      
      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${!showDetails ? 'active' : ''}`} 
          onClick={() => setShowDetails(false)}
        >
          <FaChartBar /> Hiển thị cơ bản
        </button>
        <button 
          className={`toggle-btn ${showDetails ? 'active' : ''}`} 
          onClick={() => setShowDetails(true)}
        >
          <FaUserGraduate /> Hiển thị chi tiết
        </button>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã GV</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Khoa</th>
              <th>Học vị</th>
              {showDetails && (
                <>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày gia nhập</th>
                </>
              )}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.fullName}</td>
                  <td>{new Date(teacher.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.degree}</td>
                  {showDetails && (
                    <>
                      <td>{teacher.email}</td>
                      <td>{teacher.phoneNumber}</td>
                      <td>{new Date(teacher.joinDate).toLocaleDateString('vi-VN')}</td>
                    </>
                  )}
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
                <td colSpan={showDetails ? "9" : "6"} className="no-data">Không có dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && currentTeacher && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Chỉnh sửa Giảng viên</h3>
            <form onSubmit={handleSubmitEdit}>
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
                  onChange={handleChangeInput}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={currentTeacher.dateOfBirth}
                  onChange={handleChangeInput}
                  required
                />
              </div>

              <div className="form-group">
                <label>Khoa:</label>
                <select
                  name="department"
                  value={currentTeacher.department}
                  onChange={handleChangeInput}
                  required
                >
                  <option value="">Chọn khoa</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept.abbreviation}>
                      {dept.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Học vị:</label>
                <select
                  name="degree"
                  value={currentTeacher.degree}
                  onChange={handleChangeInput}
                  required
                >
                  <option value="">Chọn học vị</option>
                  {degrees.map(degree => (
                    <option key={degree._id} value={degree.name}>
                      {degree.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={currentTeacher.email}
                  onChange={handleChangeInput}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={currentTeacher.phoneNumber}
                  onChange={handleChangeInput}
                  pattern="[0-9]{10}"
                  title="Số điện thoại phải có 10 chữ số"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày gia nhập:</label>
                <input
                  type="date"
                  name="joinDate"
                  value={currentTeacher.joinDate}
                  onChange={handleChangeInput}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal modal-confirm">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa giảng viên này?</p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStatistics;

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

  // Hàm xử lý khi submit form chỉnh sửa
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    
    // Trong thực tế, bạn sẽ gọi API để cập nhật thông tin giảng viên
    alert(`Đã cập nhật thông tin cho giảng viên ${currentTeacher.fullName}`);
    
    // Đóng modal chỉnh sửa
    setShowEditModal(false); 
  };

  // Hàm xử lý khi thay đổi dữ liệu trong form
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher({
      ...currentTeacher,
      [name]: value
    });
  };

  // Hàm thêm giảng viên mới (chuyển hướng đến trang quản lý giảng viên)
  const handleAddTeacher = () => {
    // Trong thực tế, bạn sẽ chuyển hướng đến trang quản lý giảng viên hoặc mở modal thêm mới
    window.location.href = '/QL-gv/giao-vien';
  };
  // Get list of years from join dates
  const getJoinYears = () => {
    const years = teachers.map(teacher => 
      new Date(teacher.joinDate).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a); // Unique years, sorted descending
  };
  
  // Apply filters
  const filteredTeachers = teachers.filter(teacher => {
    // If no department filter is selected or teacher belongs to selected department
    const departmentMatch = !departmentFilter || teacher.department === departmentFilter;
    
    // If no degree filter is selected or teacher has selected degree
    const degreeMatch = !degreeFilter || teacher.degree === degreeFilter;
    
    // If no year filter is selected or teacher joined in selected year
    const yearMatch = !yearFilter || new Date(teacher.joinDate).getFullYear() === parseInt(yearFilter);
    
    // Return true only if all conditions are met
    return departmentMatch && degreeMatch && yearMatch;
  });
  // Summary statistics
  const getDepartmentCount = (deptCode) => {
    return teachers.filter(t => t.department === deptCode).length;
  };

  const getDegreeCount = (degreeName) => {
    return teachers.filter(t => t.degree === degreeName).length;
  };
  
  const getAgeGroups = () => {
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
  
  // Export functions (placeholders)
  const exportToExcel = () => {
    alert('Xuất file Excel sẽ được triển khai sau');
  };
  
  const exportToPDF = () => {
    alert('Xuất file PDF sẽ được triển khai sau');
  };
  
  const printData = () => {
    window.print();
  };

  return (
    <div className="page-container">      <div className="page-header">
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
      </div>      <div className="statistics-summary">
        <div className="summary-card">
          <h3>Tổng số giảng viên</h3>
          <div className="summary-value">{teachers.length}</div>
          <div className="summary-icon"><FaUserGraduate /></div>
        </div>          <div className="summary-section">
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
      </div>
      
      <div className="filter-section">
        <h3>Lọc giảng viên</h3>
        <div className="filters">          <div className="filter-group">
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
      </div>      <div className="results-count">
        {filteredTeachers.length > 0 ? (
          <p>Hiển thị {filteredTeachers.length} giảng viên {filteredTeachers.length < teachers.length ? `(trên tổng số ${teachers.length})` : ''}</p>
        ) : (
          <p>Không tìm thấy giảng viên nào phù hợp</p>
        )}
      </div>
      
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

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>              <th>Mã GV</th>
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
          </thead>          <tbody>            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.teacherId}</td>
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

      {/* Modal Chỉnh sửa */}
      {showEditModal && currentTeacher && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Chỉnh sửa Giảng viên</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitEdit}>                <div className="form-group">
                  <label>Mã giảng viên:</label>
                  <input
                    type="text"
                    name="teacherId"
                    value={currentTeacher.teacherId}
                    disabled
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
                  >                    {departments.map(dept => (
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
        </div>
      )}      {/* Modal Xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Xác nhận xóa</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa giảng viên này không?</p>
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
        </div>
      )}
    </div>
  );
};

export default TeacherStatistics;
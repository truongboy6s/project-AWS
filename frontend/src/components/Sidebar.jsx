import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaUniversity, 
  FaUserTie, 
  FaChartBar, 
  FaChalkboardTeacher, 
  FaBook, 
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFileAlt
} from 'react-icons/fa';
import '../assets/styles/sidebar.css';
import logoKhoa from '../assets/logo-khoa.png';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleSubMenu = (menuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logoKhoa} alt="School Logo" className="school-logo" />
        <h3>Quản lý Giảng dạy</h3>
      </div>
      
      <ul className="menu-list">
        <li className={`menu-item ${activeMenu === 'teacher' ? 'active' : ''}`}>
          <div className="menu-header" onClick={() => toggleSubMenu('teacher')}>
            <FaUserTie />
            <span>Quản lý Giảng viên</span>
          </div>
          {activeMenu === 'teacher' && (
            <ul className="submenu">
              <li>
                <Link to="/QL-gv/bang-cap">
                  <FaGraduationCap /> Quản lý học vị
                </Link>
              </li>
              <li>
                <Link to="/QL-gv/khoa">
                  <FaUniversity /> Quản lý khoa
                </Link>
              </li>
              <li>
                <Link to="/QL-gv/giao-vien">
                  <FaUserTie /> Quản lý giảng viên
                </Link>
              </li>
              <li>
                <Link to="/QL-gv/thong-ke">
                  <FaChartBar /> Thống kê giảng viên
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className={`menu-item ${activeMenu === 'class' ? 'active' : ''}`}>
          <div className="menu-header" onClick={() => toggleSubMenu('class')}>
            <FaChalkboardTeacher />
            <span>Quản lý Lớp</span>
          </div>
          {activeMenu === 'class' && (
            <ul className="submenu">
              <li>
                <Link to="/QL-lop/mon-hoc">
                  <FaBook /> Quản lý môn học
                </Link>
              </li>
              <li>
                <Link to="/QL-lop/hoc-ky">
                  <FaCalendarAlt /> Quản lý học kỳ
                </Link>
              </li>
              <li>
                <Link to="/QL-lop/lop">
                  <FaChalkboardTeacher /> Quản lý lớp
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className={`menu-item ${activeMenu === 'payment' ? 'active' : ''}`}>
          <div className="menu-header" onClick={() => toggleSubMenu('payment')}>
            <FaMoneyBillWave />
            <span>Thanh toán Giảng dạy</span>
          </div>
          {activeMenu === 'payment' && (
            <ul className="submenu">
              <li>
                <Link to="/tinh-luong/dinh-muc-gio">
                  <FaMoneyBillWave /> Định mức giờ dạy
                </Link>
              </li>
              <li>
                <Link to="/tinh-luong/he-so">
                  <FaUserTie /> Hệ số giảng viên, lớp
                </Link>
              </li>
              <li>
                <Link to="/tinh-luong/phan-cong">
                  <FaChalkboardTeacher /> Phân công giảng dạy
                </Link>
              </li>
              <li>
                <Link to="/tinh-luong/tinh-toan">
                  <FaMoneyBillWave /> Tính thanh toán
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className={`menu-item ${activeMenu === 'reports' ? 'active' : ''}`}>
          <div className="menu-header" onClick={() => toggleSubMenu('reports')}>
            <FaFileAlt />
            <span>Báo cáo</span>
          </div>
          {activeMenu === 'reports' && (
            <ul className="submenu">
              <li>
                <Link to="/bao-cao/theo-nam">
                  <FaFileAlt /> Thanh toán theo năm
                </Link>
              </li>
              <li>
                <Link to="/bao-cao/theo-khoa">
                  <FaFileAlt /> Thanh toán theo khoa
                </Link>
              </li>
              <li>
                <Link to="/bao-cao/toan-truong">
                  <FaFileAlt /> Thanh toán toàn trường
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
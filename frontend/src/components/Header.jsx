import React from 'react';
import '../assets/styles/header.css';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header = ({ managerName = "Quản trị viên" }) => {
  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="header">
      <div className="manager-info">
        <span className="manager-name">{managerName}</span>
      </div>
      <div className="user-controls">
        <div className="avatar">
          <FaUserCircle size={30} />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Header;
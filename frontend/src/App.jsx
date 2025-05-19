import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DegreeManagement from './pages/QL-gv/bang-cap/bang-cap';
import DepartmentManagement from './pages/QL-gv/khoa/khoa';
import TeacherManagement from './pages/QL-gv/giao-vien/giao-vien';
import TeacherStatistics from './pages/QL-gv/thong-ke/thong-ke';
import 'react-icons/fa';
import './assets/styles/common.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/QL-gv/giao-vien" replace />} />
          
          {/* Teacher Management */}
          <Route path="/QL-gv/bang-cap" element={<DegreeManagement />} />
          <Route path="/QL-gv/khoa" element={<DepartmentManagement />} />
          <Route path="/QL-gv/giao-vien" element={<TeacherManagement />} />
          <Route path="/QL-gv/thong-ke" element={<TeacherStatistics />} />
          
          {/* Placeholders for other routes */}
          <Route path="/QL-lop/*" element={<div className="page-container"><h2>Quản lý Lớp (Đang phát triển)</h2></div>} />
          <Route path="/tinh-luong/*" element={<div className="page-container"><h2>Tính toán Thanh toán (Đang phát triển)</h2></div>} />
          <Route path="/bao-cao/*" element={<div className="page-container"><h2>Báo cáo (Đang phát triển)</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
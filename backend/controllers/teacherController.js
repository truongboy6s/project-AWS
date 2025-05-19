const Teacher = require('../models/Teacher');
const Department = require('../models/Department');
const Degree = require('../models/Degree');

// Lấy tất cả giảng viên
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách giảng viên', error: error.message });
  }
};

// Lấy một giảng viên theo ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giảng viên' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin giảng viên', error: error.message });
  }
};

// Tạo giảng viên mới
exports.createTeacher = async (req, res) => {
  try {
    const { 
      id, 
      fullName, 
      dateOfBirth, 
      department, 
      degree, 
      email, 
      phoneNumber, 
      joinDate 
    } = req.body;
    
    // Kiểm tra giảng viên đã tồn tại (theo mã GV hoặc email)
    const existingTeacher = await Teacher.findOne({ 
      $or: [{ id }, { email }]
    });
    if (existingTeacher) {
      return res.status(400).json({ 
        message: 'Giảng viên với mã hoặc email này đã tồn tại' 
      });
    }
    
    // Xác thực khoa
    const existingDepartment = await Department.findOne({ abbreviation: department });
    if (!existingDepartment) {
      return res.status(400).json({ message: 'Khoa không tồn tại' });
    }
    
    // Xác thực học vị
    const existingDegree = await Degree.findOne({ name: degree });
    if (!existingDegree) {
      return res.status(400).json({ message: 'Học vị không tồn tại' });
    }
    
    const newTeacher = new Teacher({
      id,
      fullName,
      dateOfBirth,
      department,
      degree,
      email,
      phoneNumber,
      joinDate
    });
    
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo giảng viên', error: error.message });
  }
};

// Cập nhật giảng viên
exports.updateTeacher = async (req, res) => {
  try {
    const { 
      fullName, 
      dateOfBirth, 
      department, 
      degree, 
      email, 
      phoneNumber, 
      joinDate 
    } = req.body;
    
    // Kiểm tra xem giảng viên có tồn tại không
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giảng viên' });
    }
    
    // Kiểm tra xem email mới đã tồn tại chưa (nếu có thay đổi)
    if (email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ message: 'Email này đã được sử dụng bởi giảng viên khác' });
      }
    }
    
    // Xác thực khoa
    const existingDepartment = await Department.findOne({ abbreviation: department });
    if (!existingDepartment) {
      return res.status(400).json({ message: 'Khoa không tồn tại' });
    }
    
    // Xác thực học vị
    const existingDegree = await Degree.findOne({ name: degree });
    if (!existingDegree) {
      return res.status(400).json({ message: 'Học vị không tồn tại' });
    }
    
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { 
        fullName, 
        dateOfBirth, 
        department, 
        degree, 
        email, 
        phoneNumber, 
        joinDate 
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật giảng viên', error: error.message });
  }
};

// Xóa giảng viên
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giảng viên' });
    }
    res.status(200).json({ message: 'Xóa giảng viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa giảng viên', error: error.message });
  }
};

// Thống kê giảng viên
exports.getTeacherStatistics = async (req, res) => {
  try {
    // Số lượng giảng viên theo khoa
    const departmentStats = await Department.aggregate([
      {
        $lookup: {
          from: 'teachers', // tên collection của Model Teacher
          localField: 'abbreviation',
          foreignField: 'department',
          as: 'teachers'
        }
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          abbreviation: 1,
          teacherCount: { $size: '$teachers' }
        }
      }
    ]);
    
    // Số lượng giảng viên theo học vị
    const degreeStats = await Degree.aggregate([
      {
        $lookup: {
          from: 'teachers',
          localField: 'name',
          foreignField: 'degree',
          as: 'teachers'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          teacherCount: { $size: '$teachers' }
        }
      }
    ]);
    
    // Phân nhóm giảng viên theo độ tuổi
    const currentYear = new Date().getFullYear();
    const teachers = await Teacher.find();
    const ageGroups = {
      under30: 0,
      between30And40: 0,
      between40And50: 0,
      over50: 0
    };
    
    teachers.forEach(teacher => {
      const birthYear = new Date(teacher.dateOfBirth).getFullYear();
      const age = currentYear - birthYear;
      
      if (age < 30) {
        ageGroups.under30++;
      } else if (age >= 30 && age < 40) {
        ageGroups.between30And40++;
      } else if (age >= 40 && age < 50) {
        ageGroups.between40And50++;
      } else {
        ageGroups.over50++;
      }
    });
    
    // Số lượng giảng viên theo năm gia nhập
    const joinYearStats = await Teacher.aggregate([
      {
        $group: {
          _id: { $year: '$joinDate' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    res.status(200).json({
      totalCount: teachers.length,
      departmentStats,
      degreeStats,
      ageGroups,
      joinYearStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thống kê giảng viên', error: error.message });
  }
};

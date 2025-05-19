const Department = require('../models/Department');

// Lấy tất cả khoa
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khoa', error: error.message });
  }
};

// Lấy một khoa theo ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy khoa' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin khoa', error: error.message });
  }
};

// Tạo khoa mới
exports.createDepartment = async (req, res) => {
  try {
    const { fullName, abbreviation } = req.body;
    
    // Kiểm tra khoa đã tồn tại (theo viết tắt)
    const existingDepartment = await Department.findOne({ abbreviation });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Khoa với tên viết tắt này đã tồn tại' });
    }
    
    const newDepartment = new Department({
      fullName,
      abbreviation
    });
    
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo khoa', error: error.message });
  }
};

// Cập nhật khoa
exports.updateDepartment = async (req, res) => {
  try {
    const { fullName, abbreviation } = req.body;
    
    // Kiểm tra xem khoa có tồn tại không
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy khoa' });
    }
    
    // Kiểm tra nếu đổi tên viết tắt thì tên mới đã tồn tại chưa
    if (abbreviation !== department.abbreviation) {
      const existingDepartment = await Department.findOne({ abbreviation });
      if (existingDepartment) {
        return res.status(400).json({ message: 'Khoa với tên viết tắt này đã tồn tại' });
      }
    }
    
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { fullName, abbreviation },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật khoa', error: error.message });
  }
};

// Xóa khoa
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy khoa' });
    }
    res.status(200).json({ message: 'Xóa khoa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa khoa', error: error.message });
  }
};

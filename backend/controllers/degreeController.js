const Degree = require('../models/Degree');

// Lấy tất cả học vị
exports.getAllDegrees = async (req, res) => {
  try {
    const degrees = await Degree.find();
    res.status(200).json(degrees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách học vị', error: error.message });
  }
};

// Lấy một học vị theo ID
exports.getDegreeById = async (req, res) => {
  try {
    const degree = await Degree.findById(req.params.id);
    if (!degree) {
      return res.status(404).json({ message: 'Không tìm thấy học vị' });
    }
    res.status(200).json(degree);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin học vị', error: error.message });
  }
};

// Tạo học vị mới
exports.createDegree = async (req, res) => {
  try {
    const { name, coefficient, specialization, issueDate } = req.body;
    
    // Kiểm tra học vị đã tồn tại
    const existingDegree = await Degree.findOne({ name });
    if (existingDegree) {
      return res.status(400).json({ message: 'Học vị với tên này đã tồn tại' });
    }
    
    const newDegree = new Degree({
      name,
      coefficient,
      specialization,
      issueDate
    });
    
    await newDegree.save();
    res.status(201).json(newDegree);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo học vị', error: error.message });
  }
};

// Cập nhật học vị
exports.updateDegree = async (req, res) => {
  try {
    const { name, coefficient, specialization, issueDate } = req.body;
    
    // Kiểm tra xem học vị có tồn tại không
    const degree = await Degree.findById(req.params.id);
    if (!degree) {
      return res.status(404).json({ message: 'Không tìm thấy học vị' });
    }
    
    // Kiểm tra nếu đổi tên thì tên mới đã tồn tại chưa
    if (name !== degree.name) {
      const existingDegree = await Degree.findOne({ name });
      if (existingDegree) {
        return res.status(400).json({ message: 'Học vị với tên này đã tồn tại' });
      }
    }
    
    const updatedDegree = await Degree.findByIdAndUpdate(
      req.params.id,
      { name, coefficient, specialization, issueDate },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedDegree);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật học vị', error: error.message });
  }
};

// Xóa học vị
exports.deleteDegree = async (req, res) => {
  try {
    const degree = await Degree.findByIdAndDelete(req.params.id);
    if (!degree) {
      return res.status(404).json({ message: 'Không tìm thấy học vị' });
    }
    res.status(200).json({ message: 'Xóa học vị thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa học vị', error: error.message });
  }
};

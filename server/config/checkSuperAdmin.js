const Admin = require('../models/admin');

const checkSuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only super admins are allowed.' });
    }
    next();
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkSuperAdmin;

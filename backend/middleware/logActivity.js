// middlewares/logActivity.js
const Log = require('../models/Log'); // model Log bạn sẽ tạo bên dưới

// middleware ghi log
const logActivity = async (req, res, next) => {
  try {
    const userId = req.user?._id || null; // lấy từ token hoặc session
    const action = `${req.method} ${req.originalUrl}`;
    const timestamp = new Date();

    await Log.create({ userId, action, timestamp });
  } catch (err) {
    console.error('Error logging activity:', err.message);
  }
  next(); // tiếp tục request
};

module.exports = logActivity;

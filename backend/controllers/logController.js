// backend/controllers/logController.js
const Log = require(".././backend/models/Log");

// ✅ Lấy tất cả log (Admin)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("userId", "name email role")
      .sort({ timestamp: -1 }); // mới nhất trước

    res.json({
      message: "Danh sách hoạt động người dùng",
      total: logs.length,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy logs", error: err.message });
  }
};

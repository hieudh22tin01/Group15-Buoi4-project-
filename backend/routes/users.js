const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Middleware kiểm tra quyền admin
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: insufficient role" });
  }
  next();
}

/* ======================================================
   ✅ Lấy danh sách user — chỉ admin được phép
====================================================== */
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ======================================================
   ✅ Thêm user mới — chỉ admin được phép
====================================================== */
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "Thêm user thành công!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ======================================================
   ✅ Cập nhật user — chỉ admin được phép
====================================================== */
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy user!" });

    res.json({ message: "Cập nhật user thành công!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Cập nhật thất bại", error: err.message });
  }
});

/* ======================================================
   ✅ Xóa user — chỉ admin được phép
====================================================== */
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa user!" });
  } catch (err) {
    res.status(500).json({ message: "Xóa user thất bại", error: err.message });
  }
});

/* ======================================================
   ✅ Upload Avatar — user nào cũng được
====================================================== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Chưa có file nào được tải lên!" });

      const fileUrl = `/uploads/${req.file.filename}`;

      // 👇 Cập nhật avatar cho user hiện tại
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,                      // 👈 id từ token
        { avatar: fileUrl },
        { new: true }                     // 👈 trả về user sau khi cập nhật
      ).select("-password");

      res.status(200).json({
        message: "Upload thành công!",
        filePath: fileUrl,
        user: updatedUser,                // 👈 gửi luôn user mới về frontend
      });
    } catch (err) {
      console.error("❌ Lỗi khi upload:", err);
      res.status(500).json({ message: "Lỗi server khi upload!", error: err.message });
    }
  }
);


module.exports = router;

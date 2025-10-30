const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");

const router = express.Router();

/* ----------------------------------------
   ✅ Middleware kiểm tra quyền admin
---------------------------------------- */
function adminOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Thiếu token!" });

  const token = authHeader.split(" ")[1];
  try {
    // ✅ Phải trùng với key trong authRoutes.js
    const decoded = jwt.verify(token, "secret_key_demo");

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới có quyền!" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    res.status(403).json({ message: "Token sai hoặc hết hạn!" });
  }
}

/* ----------------------------------------
   ✅ GET /api/users — chỉ admin được xem
---------------------------------------- */
router.get("/", adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ----------------------------------------
   ✅ POST /api/users — admin thêm user mới
---------------------------------------- */
router.post("/", adminOnly, async (req, res) => {
  try {
    console.log("📩 Dữ liệu nhận từ frontend:", req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

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
    console.error("❌ Lỗi server khi thêm user:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ----------------------------------------
   ✅ PUT /api/users/:id — admin cập nhật user
---------------------------------------- */
router.put("/:id", adminOnly, async (req, res) => {
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

/* ----------------------------------------
   ✅ DELETE /api/users/:id — admin xóa user
---------------------------------------- */
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa user!" });
  } catch (err) {
    res.status(500).json({ message: "Xóa user thất bại", error: err.message });
  }
});

/* ----------------------------------------
   ✅ POST /api/users/upload-avatar — admin upload avatar
---------------------------------------- */
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

router.post("/upload-avatar", adminOnly, upload.single("avatar"), async (req, res) => {
  try {
    console.log("📸 File nhận được:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Chưa có file nào được tải lên!" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "Upload thành công!",
      filePath: fileUrl,
    });
  } catch (err) {
    console.error("❌ Lỗi khi upload:", err);
    res.status(500).json({ message: "Lỗi server khi upload!", error: err.message });
  }
});

module.exports = router;

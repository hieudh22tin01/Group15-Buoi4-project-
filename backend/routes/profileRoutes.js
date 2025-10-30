const express = require("express");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret"
});

// Cấu hình multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "jpeg"]
  },
});
const upload = multer({ storage });

// Upload avatar
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Không có file tải lên!" });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Thiếu token!" });

    const decoded = jwt.verify(token, "secret_key_demo");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });

    user.avatar = req.file.path;
    await user.save();

    res.json({ message: "Upload avatar thành công!", avatar: user.avatar });
  } catch (err) {
    console.error("Lỗi upload avatar:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// Middleware xác thực
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Thiếu token!" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token không hợp lệ!" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token hết hạn hoặc sai!" });
  }
}

// ✅ Xem profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Cập nhật profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ message: "Cập nhật thành công!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

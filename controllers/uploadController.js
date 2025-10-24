const cloudinary = require("cloudinary").v2;
const User = require("../backend/models/user");
const multer = require("multer");
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});
const upload = multer({ storage });

exports.uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: "Thiếu token!" });
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });

      const user = await User.findByIdAndUpdate(decoded.id, {
        avatar: result.secure_url,
      });

      res.json({ message: "Upload thành công!", avatar: result.secure_url });
    } catch (err) {
      res.status(500).json({ message: "Lỗi upload!", error: err.message });
    }
  },
];

const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret_key_demo"; // 👈 phải TRÙNG với key trong authRoutes.js

// ✅ Middleware xác thực người dùng
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu hoặc sai token!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("🧩 Token giải mã:", decoded); // 👀 Debug ở đây để xem role
    req.user = decoded; // Gắn user vào request để adminOnly đọc được
    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    return res.status(403).json({ message: "Token sai hoặc hết hạn!" });
  }
};

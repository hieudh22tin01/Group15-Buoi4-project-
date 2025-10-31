const User = require("../backend/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../backend/utils/sendEmail");
require("dotenv").config();

const SECRET_KEY = "secret_key_demo"; // nên lưu .env

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Không tìm thấy email!" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 phút
  await user.save();

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  await sendEmail(email, "Reset mật khẩu", `Link reset: ${resetLink}`);

  res.json({ message: "Đã gửi email reset password!" });
};

exports.resetPassword = async (req, res) => {
  try {
    // NHẬN token và newPassword từ body
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing token or newPassword" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
// ✅ Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Đăng xuất (xóa token phía client)
exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công! (Client xóa token)" });
};

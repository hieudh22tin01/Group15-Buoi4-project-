console.log("✅ authRoutes.js đã được load vào server!");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// 🔹 Đăng ký tài khoản
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Quên mật khẩu
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại!" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();
console.log("✅ Token lưu vào DB:", token);
console.log("🧠 User sau khi lưu:", user);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vankhoa100704@gmail.com", // 👈 email thật của bạn
        pass: "szyr vsle eqal qppc", // 👈 App password của Gmail
      },
    });

    const link = `http://localhost:5173/reset-password?token=${token}`;
    await transporter.sendMail({
      from: "Your App",
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Nhấn vào link để đặt lại mật khẩu:</p><a href="${link}">${link}</a>`,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// 🔹 Đặt lại mật khẩu
router.post("/reset-password", async (req, res) => {
  console.log("📩 Nhận request /reset-password");
  console.log("📦 BODY:", req.body);
  const { token, password } = req.body; // ✅ sửa ở đây
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    console.log("🟢 Token nhận từ frontend:", token);
    console.log("🟢 User tìm thấy:", user);

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (err) {
    console.error("❌ Lỗi reset password:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// 🔹 Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      "secret_key_demo",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

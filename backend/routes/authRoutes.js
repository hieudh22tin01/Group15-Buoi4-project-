console.log("✅ authRoutes.js đã được load vào server!");

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");

// ====================== CONFIG ======================
const JWT_SECRET = "secret_key_demo";
const JWT_REFRESH_SECRET = "refresh_secret_key";

// ====================== ĐĂNG KÝ ======================
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
      role: role?.toLowerCase() || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("❌ Lỗi signup:", err);
    res.status(500).json({ message: err.message });
  }
});

// ====================== QUÊN MẬT KHẨU ======================
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
    console.log("📧 Gửi mail reset cho:", user.email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vankhoa100704@gmail.com", // Gmail thật
        pass: "szyr vsle eqal qppc", // App password
      },
    });

    const link = `http://localhost:5173/reset-password?token=${token}`;
    await transporter.sendMail({
      from: "Your App <vankhoa100704@gmail.com>",
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Nhấn vào link để đặt lại mật khẩu (15 phút hiệu lực):</p><a href="${link}">${link}</a>`,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ====================== ĐẶT LẠI MẬT KHẨU ======================
router.post("/reset-password", async (req, res) => {
  console.log("📩 Nhận request /reset-password");
  console.log("📦 BODY:", req.body);

  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    console.log("🟢 Token nhận từ frontend:", token);
    console.log("🟢 User tìm thấy:", user ? user.email : "null");

    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

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

// ====================== ĐĂNG NHẬP (Access + Refresh) ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await RefreshToken.create({ userId: user._id, token: refreshToken });

    res.json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: err.message });
  }
});

// ====================== REFRESH TOKEN ======================
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Thiếu refresh token!" });

  try {
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored)
      return res.status(403).json({ message: "Refresh token không hợp lệ!" });

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: payload.id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("❌ Lỗi refresh token:", err.message);
    res.status(403).json({ message: "Refresh token hết hạn hoặc không hợp lệ!" });
  }
});

// ====================== LOGOUT ======================
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ message: "Đăng xuất thành công!" });
  } catch (err) {
    console.error("❌ Lỗi logout:", err.message);
    res.status(500).json({ message: "Lỗi khi đăng xuất!" });
  }
});

module.exports = router;

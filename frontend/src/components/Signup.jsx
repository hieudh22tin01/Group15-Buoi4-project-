const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // ✅ Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

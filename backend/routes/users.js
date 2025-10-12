const express = require("express");
const router = express.Router();
const User = require("../models/user"); // ✅ import model từ MongoDB

// ✅ GET /users → lấy danh sách user từ MongoDB
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // lấy tất cả user từ database
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /users → thêm user mới vào MongoDB
router.post("/", async (req, res) => {
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const newUser = new User({ name, email });
    const savedUser = await newUser.save(); // lưu vào MongoDB
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

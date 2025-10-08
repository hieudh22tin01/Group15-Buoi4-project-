const express = require("express");
const router = express.Router();

// Tạm danh sách user trong bộ nhớ
let users = [
  { id: 1, name: "Nguyen Van Khoa" },
  { id: 2, name: "Tran Nguyen Minh Hieu" }
];

// GET /users → lấy danh sách
router.get("/", (req, res) => {
  res.json(users);
});

// POST /users → thêm user mới
router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newUser = {
    id: users.length + 1,
    name
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;

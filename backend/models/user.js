const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
});

module.exports = mongoose.model("User", userSchema);
=======
// Định nghĩa schema cho user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // bắt buộc phải có name
    trim: true      // tự động xóa khoảng trắng đầu/cuối
  },
  email: {
    type: String,
    required: false, // không bắt buộc (vì code bạn ban đầu chỉ có name)
    trim: true
  }
});

// Tạo model User (tên collection sẽ là "users")
const User = mongoose.model("User", userSchema);

module.exports = User;


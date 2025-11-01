const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ✅ Bổ sung trường avatar để lưu đường dẫn ảnh
    avatar: {
      type: String,
      default: "", // Mặc định rỗng nếu chưa upload
    },

    // ✅ Role xác định quyền người dùng
    role: {
      type: String,
      enum: ["user", "admin", "moderator"], // chỉ cho phép 3 loại role
      default: "user",
    },

    // ✅ Các trường phục vụ reset mật khẩu
    resetToken: {
      type: String,
    },
    resetTokenExp: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;

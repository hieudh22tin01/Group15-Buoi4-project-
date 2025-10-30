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
    role: {
      type: String,
      enum: ["user", "admin"], // 👈 chỉ chứa loại role
      default: "user",
    },

    // ✅ Những trường này PHẢI ở ngoài role
    avatar: { type: String },       // link ảnh Cloudinary hoặc local
    resetToken: String,             // token reset mật khẩu
    resetTokenExp: Date,            // thời hạn token
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;

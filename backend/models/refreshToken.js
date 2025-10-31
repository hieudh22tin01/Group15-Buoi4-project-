const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" } // tự xóa sau 7 ngày
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);

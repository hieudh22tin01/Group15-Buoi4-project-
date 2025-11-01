// backend/models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);

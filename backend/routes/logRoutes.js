// backend/routes/logRoutes.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 });
  res.json(logs);
});

module.exports = router;

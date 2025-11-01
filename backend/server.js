// backend/server.js
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") }); // ✅ Ép Node đọc đúng file .env
console.log("🔍 PORT từ .env:", process.env.PORT);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");


// ✅ Khởi tạo app
const app = express();

// ✅ Middleware chung
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://vankhoa100704_db_user:rKavUAL73QFVBmo4@cluster0.wq1cw4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    await createDefaultAdmin();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Hàm tạo admin mặc định
async function createDefaultAdmin() {
  try {
    const adminEmail = "vankhoa100704@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("ℹ️ Admin already exists:", adminEmail);
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);
    const newAdmin = new User({
      name: "Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("✅ Default admin created:", adminEmail);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

// ✅ Import route modules
const authRoutes = require("./routes/authRoutes");  // <── chính là file bạn gửi
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/uploadRoutes");
const logRoutes = require("./routes/logRoutes");
// ✅ Sử dụng routes có prefix /api/
app.use("/api/auth", authRoutes);       // <── route login/signup/... có rateLimit & log
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/logs", require("./routes/logRoutes"));
// ✅ Route gốc để test server
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

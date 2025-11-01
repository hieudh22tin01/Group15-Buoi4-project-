// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user"); // 👈 dùng để tạo admin

// ✅ KHÔNG cần require("./routes/auth") ở đây

// ✅ Khởi tạo app
const app = express();

// ✅ Middleware
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://vankhoa100704_db_user:rKavUAL73QFVBmo4@cluster0.wq1cw4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // 🔥 Tạo tài khoản admin mặc định nếu chưa có
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
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/users");


// ✅ Sử dụng route — có tiền tố /api/
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/uploads", express.static("uploads"));



// ✅ Kiểm tra route gốc
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// ✅ Khởi chạy server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

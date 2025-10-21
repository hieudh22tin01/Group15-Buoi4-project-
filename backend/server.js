const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://vankhoa100704_db_user:rKavUAL73QFVBmo4@cluster0.wq1cw4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Import routesno
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const port = 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

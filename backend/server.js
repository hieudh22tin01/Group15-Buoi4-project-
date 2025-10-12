const express = require("express");
const mongoose = require("mongoose"); // import mongoose
const app = express();
const port = 3000;

app.use(express.json());

// ✅ Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://vankhoa100704_db_user:rKavUAL73QFVBmo4@cluster0.wq1cw4t.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// test route
app.get("/", (req, res) => {
  res.send("Backend OK");
});

// import routes
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

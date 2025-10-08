const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Trang chủ API đang hoạt động 🚀");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



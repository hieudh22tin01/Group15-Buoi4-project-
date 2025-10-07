// server.js
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // để đọc body JSON
const userRoutes = require("./routes/user");

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

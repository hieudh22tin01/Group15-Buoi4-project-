let users = [
  { id: 1, name: "Nguyen Van Khoa" },
  { id: 2, name: "Tran Nguyen Minh Hieu" }
];

const getUsers = (req, res) => {
  res.json(users);
};

const createUser = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };

import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get("http://localhost:3000/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải danh sách users:", err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>📋 Danh sách User</h2>
      {users.length === 0 ? (
        <p>Chưa có user nào</p>
      ) : (
        <ul>
          {users.map((u, index) => (
            <li key={index}>{u.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

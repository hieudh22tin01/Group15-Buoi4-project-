import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/users";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🧠 Lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Chưa có token — vui lòng đăng nhập admin!");
        return;
      }

      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách users:", err);
      if (err.response?.status === 403) {
        alert("Bạn không có quyền xem danh sách người dùng (403 Forbidden)");
      } else if (err.response?.status === 401) {
        alert("Token hết hạn hoặc không hợp lệ — vui lòng đăng nhập lại!");
      } else {
        alert("Không thể tải danh sách người dùng.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
  e.preventDefault();

  if (!name.trim() || !email.trim()) {
    alert("Vui lòng nhập đầy đủ tên và email!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập admin!");
      return;
    }
console.log("📦 Dữ liệu gửi lên:", { name, email, password: "123456", role: "User" });
    const res = await axios.post(
      API,
      {
        name,
        email,
        password: "123456",
        role: "User",
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("✅ " + res.data.message);
    setName("");
    setEmail("");
    fetchUsers(); // reload danh sách
  } catch (err) {
    console.error("❌ Lỗi khi thêm user:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Lỗi khi thêm user!");
  }
};


  return (
    <div style={{ marginTop: "20px" }}>
      <h2>👥 Danh sách người dùng</h2>

      {/* 🔹 Form thêm người dùng */}
      <form onSubmit={handleAddUser} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Thêm user</button>
      </form>

      {/* 🔹 Danh sách người dùng */}
      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : users.length === 0 ? (
        <p>⚠️ Không có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id}>
              <strong>{u.name}</strong> — {u.email} ({u.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

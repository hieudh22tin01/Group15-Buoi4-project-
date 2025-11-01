import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🧠 Lấy danh sách user (dùng axiosInstance tự refresh token)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🧩 Thêm người dùng mới
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("⚠️ Vui lòng nhập đầy đủ tên và email!");
      return;
    }

    try {
      console.log("📦 Dữ liệu gửi lên:", {
        name,
        email,
        password: "123456",
        role: "User",
      });

      const res = await axiosInstance.post("/users", {
        name,
        email,
        password: "123456",
        role: "User",
      });

      alert("✅ " + res.data.message);
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err);
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

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🧠 Hàm lấy danh sách người dùng
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

  // 🔄 Lắng nghe sự kiện cập nhật avatar từ UploadAvatar.jsx
  useEffect(() => {
    fetchUsers();

    const handleAvatarUpdate = () => {
      console.log("📢 avatar-updated event received → reload user list");
      fetchUsers();
    };

    window.addEventListener("avatar-updated", handleAvatarUpdate);
    return () => window.removeEventListener("avatar-updated", handleAvatarUpdate);
  }, []);

  // ➕ Thêm user mới
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await axiosInstance.post("/users", {
        name,
        email,
        password: "123456",
        role: "user",
      });

      alert("✅ " + res.data.message);
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm user!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-50 flex flex-col items-center p-10">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold text-purple-700">👑 Quản lý người dùng</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>

      {/* 🔹 Form thêm user */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mb-10">
        <h2 className="font-semibold mb-4 text-lg">Thêm người dùng</h2>
        <form onSubmit={handleAddUser} className="flex gap-2">
          <input
            type="text"
            placeholder="Tên"
            className="border p-2 rounded w-1/2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-1/2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded"
          >
            ➕
          </button>
        </form>
      </div>

      {/* 🔹 Danh sách user */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="font-semibold text-lg">📋 Danh sách người dùng</h2>
          <button
            onClick={fetchUsers}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
          >
            🔄 Tải lại
          </button>
        </div>

        {loading ? (
          <p>⏳ Đang tải...</p>
        ) : users.length === 0 ? (
          <p>⚠️ Không có người dùng nào.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u._id} className="flex items-center gap-4 border-b pb-2">
                {/* 🖼️ Avatar */}
                <img
                  src={
                    u.avatar
                      ? u.avatar.startsWith("http")
                        ? u.avatar
                        : `http://localhost:5000${u.avatar}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border"
                />

                {/* 🧾 Thông tin người dùng */}
                <div className="flex-1">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500 italic">{u.email}</p>
                </div>

                {/* 🧩 Vai trò */}
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    u.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : u.role === "moderator"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🖼️ Nút upload avatar */}
      <button
        onClick={() => (window.location.href = "/upload-avatar")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        🖼️ Upload Avatar
      </button>
    </div>
  );
}

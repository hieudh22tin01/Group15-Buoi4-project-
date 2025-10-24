import { useState } from "react";
import axios from "axios";

export default function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập admin!");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/users", // ⚙️ Đổi port nếu backend chạy port khác
        {
          name: form.name,
          email: form.email,
          password: "123456",
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      alert("✅ " + res.data.message);
      setName("");
      setEmail("");
      onUserAdded();
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Lỗi khi thêm user!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm người dùng</h2>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
}

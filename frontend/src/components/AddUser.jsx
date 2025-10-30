import { useState } from "react";
import axios from "axios";

export default function AddUser({ onUserAdded }) {
  console.log("🔥 AddUser component loaded from frontend/src/components/AddUser.jsx");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!name.trim() || !email.trim()) {
    setError("⚠️ Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    // ✅ Lấy token admin
    const token = localStorage.getItem("token");
    if (!token) {
      setError("❌ Thiếu token đăng nhập admin. Hãy đăng nhập lại!");
      return;
    }

    // ✅ Log ra console để kiểm tra dữ liệu gửi
    console.log("🚀 Sending user data:", {
      name,
      email,
      password: "123456", // mật khẩu mặc định
    });

    // ✅ Gửi request có mật khẩu mặc định
    await axios.post(
      "http://localhost:5000/api/users",
      {
        name,
        email,
        password: "123456",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("✅ Thêm người dùng thành công (mật khẩu: 123456)!");
    setName("");
    setEmail("");
    if (onUserAdded) onUserAdded();
  } catch (err) {
    console.error("❌ Lỗi khi thêm user:", err);
    const msg =
      err.response?.data?.message ||
      (err.response?.status === 401
        ? "❌ Token không hợp lệ hoặc thiếu quyền admin."
        : "Lỗi server, vui lòng thử lại.");
    setError(msg);
  }
};



  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Thêm người dùng</h2>

      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full border rounded p-2 mb-2"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full border rounded p-2 mb-2"
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Thêm
      </button>
    </form>
  );
}

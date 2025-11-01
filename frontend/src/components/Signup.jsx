import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 👈 thêm role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role, // 👈 gửi role lên server
      });

      alert("🎉 Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "❌ Lỗi đăng ký!";
      alert(msg);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Đăng ký
        </h2>

        <input
          type="text"
          placeholder="Tên"
          className="border rounded w-full p-2 mb-3 focus:outline-purple-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded w-full p-2 mb-3 focus:outline-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="border rounded w-full p-2 mb-3 focus:outline-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 👇 Thêm dropdown chọn vai trò */}
        <select
          className="border rounded w-full p-2 mb-4 focus:outline-purple-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">👤 User</option>
          <option value="moderator">🛡️ Moderator</option>
          <option value="admin">👑 Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md font-medium"
        >
          Đăng ký
        </button>

        <p className="mt-3 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-purple-600 font-medium">
            Đăng nhập
          </a>
        </p>
      </form>
    </div>
  );
}

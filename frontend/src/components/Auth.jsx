import React, { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [token, setToken] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const API = "http://localhost:3000/api/auth";

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const url = isLogin ? `${API}/login` : `${API}/signup`;
      const res = await axios.post(url, form);
      if (isLogin) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      }
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>

        {!isLogin && (
          <input
            name="name"
            placeholder="Tên"
            className="border p-2 w-full mb-2 rounded"
            onChange={handleChange}
          />
        )}
        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2 rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600"
        >
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center text-blue-600 mt-3 cursor-pointer"
        >
          {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </p>

        {token && (
          <p className="text-xs text-green-600 mt-2 break-all">
            Token: {token}
          </p>
        )}
      </div>
    </div>
  );
}

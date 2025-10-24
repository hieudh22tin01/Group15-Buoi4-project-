import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi gửi email!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="border p-2 w-full mb-3"
          placeholder="Nhập email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Gửi</button>
      </form>
      {message && <p className="mt-3 text-green-600">{message}</p>}
    </div>
  );
}

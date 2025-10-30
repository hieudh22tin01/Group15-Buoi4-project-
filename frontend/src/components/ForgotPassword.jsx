import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      console.log("📩 Gửi yêu cầu quên mật khẩu:", email);

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      console.log("✅ Phản hồi từ server:", res.data);
      setMessage(res.data.message || "Email đặt lại mật khẩu đã được gửi!");
    } catch (err) {
      console.error("❌ Lỗi khi gửi yêu cầu:", err.response?.data);
      setMessage(err.response?.data?.message || "Lỗi gửi email!");
    } finally {
      setLoading(false);
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
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 ${
            message.includes("Lỗi") ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

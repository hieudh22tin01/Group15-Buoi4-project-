import React, { useState } from "react";
import axios from "axios";

function ResetPassword() {
  // ✅ Dùng window.location để chắc chắn luôn lấy được token
  const token = new URLSearchParams(window.location.search).get("token");
  console.log("🔑 Token gửi đi:", token);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔗 URL hiện tại:", window.location.href);
    console.log("🔑 Token lấy được:", token);


    if (!token) {
      setMessage("❌ Token không tồn tại trong URL!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token, // ✅ bây giờ chắc chắn có token trong body
        password,
      });

      setMessage(res.data.message || "✅ Đặt lại mật khẩu thành công!");
    } catch (err) {
      console.error("Lỗi khi reset:", err.response?.data);
      setMessage(err.response?.data?.message || "❌ Token không hợp lệ hoặc đã hết hạn!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-3 text-center text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;

import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // ✅ Lưu token và thông tin user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Đăng nhập thành công!");
      if (onLogin) onLogin(res.data.user);
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setError(err.response?.data?.message || "Lỗi kết nối server");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>🔐 Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Đăng nhập</button>
      </form>

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
    </div>
  );
}

export default Login;

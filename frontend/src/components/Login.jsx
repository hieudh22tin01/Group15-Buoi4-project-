import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice"; // ⚠️ Cập nhật đường dẫn mới
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        alert("🎉 Đăng nhập thành công!");
        navigate("/users");
      })
      .catch((err) => console.error("❌ Lỗi đăng nhập:", err));
  };

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <h2>🔐 Đăng nhập</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "250px",
          margin: "0 auto",
        }}
      >
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#6a0dad",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
      {user && <p style={{ color: "green" }}>Xin chào, {user.name || "User"} 👋</p>}
    </div>
  );
}

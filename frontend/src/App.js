import { useState, useEffect } from "react";
import axios from "axios";
import ResetPassword from "./components/ResetPassword";
import AdminLogs from "./components/AdminLogs";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Đã thêm Protected Route
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Pencil, Trash2, Upload } from "lucide-react";

const API = "http://localhost:5000/api";

// ============================
// COMPONENT: QUẢN LÝ NGƯỜI DÙNG
// ============================
function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách users:", err);
        alert("Không thể tải danh sách người dùng. Kiểm tra backend!");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Nhập đầy đủ thông tin!");
    const token = localStorage.getItem("token");
    try {
      if (editingId) {
        await axios.put(`${API}/users/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/users`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", email: "" });
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Không thể lưu thông tin user!");
    }
  };

  const handleEdit = (u) => {
    setForm({ name: u.name, email: u.email });
    setEditingId(u._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Không thể xóa user!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-50 flex flex-col items-center p-10">
      <div className="flex justify-between items-center w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold text-purple-700">
          👑 Quản lý người dùng
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/logs")}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            📜 Xem Log
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mb-10">
        <h2 className="font-semibold mb-4 text-lg">Thêm / Sửa người dùng</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tên"
            className="border p-2 rounded w-1/2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-1/2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 rounded"
          >
            {editingId ? "💾 Lưu" : "✔ Thêm"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="font-semibold mb-4 text-lg">📋 Danh sách người dùng</h2>
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <span className="font-bold">{u.name}</span> —{" "}
                <span className="text-gray-500 italic">{u.email}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                >
                  <Pencil size={16} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="flex items-center gap-1 px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-red-700"
                >
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/upload-avatar")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        🖼️ Upload Avatar
      </button>
    </div>
  );
}

// ============================
// COMPONENT: FORGOT PASSWORD
// ============================
function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      alert("Đã gửi email reset mật khẩu!");
    } catch {
      alert("Email không tồn tại!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Quên mật khẩu 🔐
        </h2>
        <input
          type="email"
          placeholder="Nhập email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded"
        >
          Gửi liên kết đặt lại
        </button>
      </form>
    </div>
  );
}

// ============================
// COMPONENT: UPLOAD AVATAR
// ============================
function UploadAvatar() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Chưa chọn ảnh!");
    const formData = new FormData();
    formData.append("avatar", file);
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API}/users/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Upload thành công!");
      navigate("/users");
    } catch {
      alert("Upload thất bại!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Upload Avatar 🖼️</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Upload className="inline-block mr-2" size={16} />
          Tải lên
        </button>
      </div>
    </div>
  );
}

// ============================
// COMPONENT: ĐĂNG KÝ (CÓ ROLE)
// ============================
function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/signup`, form);
      alert("🎉 Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Đăng ký tài khoản
        </h2>

        <input
          type="text"
          placeholder="Tên"
          className="w-full p-2 mb-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 mb-4 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full p-2 mb-4 border rounded bg-white"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">👤 User</option>
          <option value="moderator">🛡️ Moderator</option>
          <option value="admin">👑 Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white p-2 rounded"
        >
          Đăng ký
        </button>

        <p className="text-sm mt-3 text-center">
          Đã có tài khoản?{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}

// ============================
// COMPONENT: ĐĂNG NHẬP
// ============================
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      alert("Đăng nhập thành công!");
      navigate("/users");
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 mb-4 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded"
        >
          Đăng nhập
        </button>
        <p className="text-sm mt-3 text-center">
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Quên mật khẩu?
          </span>
        </p>
        <p className="text-sm mt-1 text-center">
          Chưa có tài khoản?{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Đăng ký
          </span>
        </p>
      </form>
    </div>
  );
}

// ============================
// APP CHÍNH (BẢO VỆ ROUTES)
// ============================
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-avatar"
          element={
            <ProtectedRoute>
              <UploadAvatar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute>
              <AdminLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

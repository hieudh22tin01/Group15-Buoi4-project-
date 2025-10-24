import { useState, useEffect } from "react";
import axios from "axios";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
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
        <h1 className="text-3xl font-bold text-purple-700">👑 Quản lý người dùng</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Đăng xuất
        </button>
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
// COMPONENT: RESET PASSWORD
// ============================
function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/reset-password`, {
  token,        // token nằm trong body
  newPassword: password,     // mật khẩu mới
});
      alert("Cập nhật mật khẩu thành công!");
      navigate("/login");
    } catch {
      alert("Token không hợp lệ hoặc đã hết hạn!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Đặt lại mật khẩu 🗝️
        </h2>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Xác nhận
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
// COMPONENT: ĐĂNG KÝ
// ============================
function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/signup`, form);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
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
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded"
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
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công!");
      navigate("/users");
    } catch {
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
// APP CHÍNH
// ============================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/upload-avatar" element={<UploadAvatar />} />
      </Routes>
    </Router>
  );
}

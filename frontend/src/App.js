import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, UserPlus } from "lucide-react"; // icons

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/users";

  useEffect(() => {
    axios.get(API).then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Nhập đầy đủ thông tin!");
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: "", email: "" });
    const res = await axios.get(API);
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      await axios.delete(`${API}/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  const handleEdit = (u) => {
    setForm({ name: u.name, email: u.email });
    setEditingId(u._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-50 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
        🤖 Quản lý người dùng 🤖
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mb-10">
        <h2 className="font-semibold mb-4 text-lg">Thêm người dùng</h2>
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
            {editingId ? "💾 Lưu" : " ✔ Thêm "}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
          💩 Danh sách người dùng 💩
        </h2>
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <span className="font-bold text-gray-700">{u.name}</span>{" "}
                — <span className="text-gray-500 italic">{u.email}</span>
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
    </div>
  );
}

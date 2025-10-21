import { useEffect, useState } from "react";
import axios from "axios";

// 👉 Cấu hình 1 biến URL để dễ đổi sau này
const API_URL = "http://localhost:3000";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // ✅ Lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách users:", err);
      alert("Không thể tải danh sách người dùng. Kiểm tra backend!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      alert("Không thể xóa người dùng!");
    }
  };

  // ✅ Bắt đầu sửa
  const startEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email || "");
  };

  // ✅ Hủy sửa
  const cancelEdit = () => {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
  };

  // ✅ Lưu user sau khi sửa
  const handleUpdate = async () => {
    if (!editName.trim()) {
      alert("Tên không được để trống!");
      return;
    }
    try {
      await axios.put(`${API_URL}/users/${editingUser._id}`, {
        name: editName,
        email: editEmail,
      });
      cancelEdit();
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật user:", err);
      alert("Không thể cập nhật người dùng!");
    }
  };

  // ✅ Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>💩Danh sách người dùng💩</h2>
      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : users.length === 0 ? (
        <p>⚠️ Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id || u.id} style={{ marginBottom: "10px" }}>
              {editingUser?._id === u._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tên"
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email"
                    style={{ marginLeft: "5px" }}
                  />
                  <button onClick={handleUpdate} style={{ marginLeft: "5px" }}>
                    💾 Lưu
                  </button>
                  <button onClick={cancelEdit} style={{ marginLeft: "5px" }}>
                    ❌ Hủy
                  </button>
                </>
              ) : (
                <>
                  <strong>{u.name}</strong> {u.email && <> — <em>{u.email}</em></>}
                  <button onClick={() => startEdit(u)} style={{ marginLeft: "10px" }}>
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    🗑️ Xóa
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

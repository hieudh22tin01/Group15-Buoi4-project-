import { useState } from "react";
import axios from "axios";

export default function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      await axios.post("http://localhost:3000/users", { name });
      setName("");
      onUserAdded(); // gọi lại để refresh danh sách
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>+ Thêm User</button>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Chưa chọn ảnh!");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAvatarUrl(res.data.avatar);
      setMessage("Upload thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload lỗi!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Avatar</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
      {message && <p className="mt-3 text-green-600">{message}</p>}
      {avatarUrl && <img src={avatarUrl} alt="avatar" className="mt-3 w-32 h-32 rounded-full" />}
    </div>
  );
}

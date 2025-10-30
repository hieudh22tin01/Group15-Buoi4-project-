import React, { useState } from "react";
import axios from "axios";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("⚠️ Vui lòng chọn ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file); // ✅ Đúng tên trùng với backend: upload.single("avatar")

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Thiếu token, vui lòng đăng nhập lại!");
        return;
      }

      // ✅ Gửi request đúng endpoint backend
      const res = await axios.post(
        "http://localhost:5000/api/users/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Backend trả về filePath — ghép với host để tạo URL đầy đủ
      const fullUrl = `http://localhost:5000${res.data.filePath}`;
      setAvatarUrl(fullUrl);
      setMessage("✅ Upload thành công!");
    } catch (err) {
      console.error("❌ Upload lỗi:", err);
      setMessage(err.response?.data?.message || "❌ Upload thất bại!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Avatar</h2>

      <form onSubmit={handleUpload} className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* Hiển thị ảnh sau khi upload */}
      {avatarUrl && (
        <div className="mt-4 text-center">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-32 h-32 mx-auto rounded-full object-cover border"
          />
          <p className="text-sm text-gray-600 mt-2 break-all">{avatarUrl}</p>
        </div>
      )}
    </div>
  );
}

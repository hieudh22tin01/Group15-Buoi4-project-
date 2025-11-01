import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Vui lòng chọn ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // 📤 Gửi file lên server (dùng axiosInstance đã có token)
      const res = await axiosInstance.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Lấy URL ảnh từ server
      const fullUrl = `http://localhost:5000${res.data.filePath}`;
      setAvatarUrl(fullUrl);
      setMessage("✅ Upload thành công!");

      // 🔔 Gửi sự kiện để UserList.jsx tự reload danh sách user
      window.dispatchEvent(new Event("avatar-updated"));
    } catch (err) {
      console.error("❌ Lỗi upload:", err);
      setMessage(err.response?.data?.message || "❌ Upload thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-2xl text-center mt-10">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">🖼️ Upload Avatar</h2>

      <form onSubmit={handleUpload} className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setPreview(URL.createObjectURL(selectedFile));
            }
          }}
          className="mb-3"
        />

        {/* 🖼️ Hiển thị preview ảnh trước khi upload */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 rounded-full object-cover border mb-3"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📤 Upload
        </button>
      </form>

      {/* 🧾 Hiển thị trạng thái */}
      {message && (
        <p
          className={`mt-3 ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("⚠️")
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* ✅ Hiển thị ảnh đã upload */}
      {avatarUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Ảnh đã tải lên:</p>
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover border"
          />
          <p className="text-xs text-gray-500 mt-2 break-all">{avatarUrl}</p>
        </div>
      )}

      {/* 🔙 Quay lại trang quản lý */}
      <button
        onClick={() => (window.location.href = "/user-list")}
        className="mt-6 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        ⬅️ Quay lại danh sách người dùng
      </button>
    </div>
  );
}

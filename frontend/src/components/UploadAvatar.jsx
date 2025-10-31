import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance"; // ✅ dùng axiosInstance tự refresh token

export default function UploadAvatar() {
  const [file, setFile] = useState(null);
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
      formData.append("avatar", file); // 👈 Tên field trùng với backend (upload.single("avatar"))

      // Gọi API qua axiosInstance (có auto refresh token)
      const res = await axiosInstance.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Backend trả về { filePath: ".../uploads/abc.png" }
      const fullUrl = `http://localhost:5000${res.data.filePath}`;
      setAvatarUrl(fullUrl);
      setMessage("✅ Upload thành công!");
    } catch (err) {
      console.error("❌ Lỗi upload:", err);
      if (err.response?.status === 401) {
        setMessage("⚠️ Phiên đăng nhập hết hạn. Đang thử refresh token...");
      } else {
        setMessage(err.response?.data?.message || "❌ Upload thất bại!");
      }
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

      {/* ✅ Hiển thị ảnh sau khi upload */}
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

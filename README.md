# 🚀 Dự án Quản Lý Người Dùng (User Management System)

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)
![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=flat-square&logo=react)
![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

---

## 📝 Mô tả
Dự án này là một ứng dụng **CRUD (Create - Read - Update - Delete)** cho phép quản lý người dùng, bao gồm các tính năng:
- 👤 Đăng ký / Đăng nhập / Đặt lại mật khẩu
- 🔐 Phân quyền người dùng (Admin / User)
- 📸 Upload avatar cá nhân
- 🧱 Bảo mật token JWT, giới hạn số lần đăng nhập sai
- 🧾 Ghi log hoạt động người dùng (Admin có thể xem)

---

## 🧰 Công nghệ sử dụng
### 🔹 Frontend
- ⚛️ **ReactJS (CRA)**
- ⚙️ **Redux Toolkit** (quản lý state & Protected Routes)
- 🌐 **Axios** (gọi API backend)
- 🎨 **Tailwind CSS** (tạo giao diện nhanh, hiện đại)

### 🔹 Backend
- 🧠 **Node.js + Express.js**
- 💾 **MongoDB Atlas**
- 🔐 **JWT Authentication** + **bcryptjs** (mã hóa mật khẩu)
- 🪣 **Multer** (upload avatar)
- 📜 **Rate Limiting + Logging**

---

## ⚙️ Hướng dẫn chạy dự án

### 1️⃣ Chạy Backend
```bash
cd backend
npm install
node server.js
Server mặc định chạy tại: http://localhost:5000
2️⃣ Chạy Frontend
```bash
cd frontend
npm install
npm start
Frontend mặc định chạy tại: http://localhost:5173

---

🔐 Tài khoản mặc định
👑 Admin 
Email:admin@gmail.com
Mật_khẩu:123456

---

Cấu trúc dự án
Group15-Buoi4-project/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   ├── store/
│   │   └── App.js
│   └── package.json
│
└── README.md
🌟 Ghi chú
Đảm bảo bật MongoDB Atlas hoặc kết nối internet trước khi khởi chạy.
Kiểm tra file .env trong thư mục backend để thay đổi cấu hình (PORT, Mongo URI, JWT Secret,...).
Cập nhật dependencies bằng: npm update
📦 Deploy

🌍 Frontend: Vercel

☁️ Backend: Render / Railway / Cyclic

🧰 Database: MongoDB Atlas
✨ Dự án được thực hiện - Nhóm 15.
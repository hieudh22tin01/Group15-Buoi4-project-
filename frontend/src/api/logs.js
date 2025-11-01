// src/api/logs.js
import axiosInstance from "./axiosInstance";

export const fetchLogs = async () => {
  try {
    const res = await axiosInstance.get("/logs");
    return res.data.data; // backend trả { data: [...] }
  } catch (err) {
    console.error("❌ Lỗi khi lấy logs:", err);
    throw err;
  }
};

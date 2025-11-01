import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Hàm tải log
  const fetchLogs = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Đảm bảo res.data luôn là mảng
    const logsData = Array.isArray(res.data)
      ? res.data
      : res.data?.logs || []; // nếu backend trả { logs: [...] }

    setLogs(logsData);
  } catch (err) {
    console.error("❌ Lỗi khi tải log:", err);
    alert("Không thể tải log! Kiểm tra backend hoặc token.");
    setLogs([]); // ✅ tránh lỗi filter
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchLogs();
  }, []);

  // ✅ Lọc log theo từ khóa tìm kiếm
  const filteredLogs = logs.filter(
    (l) =>
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            🧾 Nhật ký hoạt động người dùng
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => fetchLogs()}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <RefreshCcw size={16} /> Làm mới
            </button>
            <button
              onClick={() => navigate("/users")}
              className="flex items-center gap-1 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              <ArrowLeft size={16} /> Quay lại
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="🔍 Tìm theo action hoặc email..."
            className="border p-2 rounded w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-gray-500 self-center">
            Tổng: {filteredLogs.length} bản ghi
          </span>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-10">⏳ Đang tải log...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            Không có hoạt động nào được ghi nhận.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-200 text-left">
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Người dùng</th>
                  <th className="p-3 border">Hành động</th>
                  <th className="p-3 border">IP</th>
                  <th className="p-3 border">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log._id || index}
                    className="hover:bg-purple-50 transition-all"
                  >
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      {log.email || log.userId || "N/A"}
                    </td>
                    <td className="border p-2">{log.action}</td>
                    <td className="border p-2">{log.ip || "unknown"}</td>
                    <td className="border p-2 text-gray-600 text-sm">
                      {new Date(log.timestamp).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 🧠 Interceptor thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("🔍 Token đang gửi lên backend:", token);

    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Không có token hợp lệ trong localStorage!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 Interceptor xử lý khi token hết hạn (HTTP 403 hoặc 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 403/401, thử refresh token
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken || refreshToken === "undefined") {
        console.warn("⚠️ Không có refreshToken, cần đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {
          refreshToken,
        });

        localStorage.setItem("token", res.data.accessToken);
        console.log("🔁 Token đã được làm mới:", res.data.accessToken);

        // Gửi lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Refresh token thất bại:", refreshErr);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

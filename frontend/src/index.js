import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// 🧩 Import Redux
import { Provider } from "react-redux";
import store from "./store/store"; // <-- đường dẫn đến file store.js bạn tạo

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* ✅ Kết nối Redux store vào toàn bộ ứng dụng */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();


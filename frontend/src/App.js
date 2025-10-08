import { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [reloadFlag, setReloadFlag] = useState(false);

  const handleUserAdded = () => {
    // Mỗi lần thêm user thì đổi flag để UserList render lại
    setReloadFlag(prev => !prev);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 Quản lý Users (React + Express)</h1>
      <AddUser onUserAdded={handleUserAdded} />
      {/* key giúp component render lại khi flag đổi */}
      <UserList key={reloadFlag} />
    </div>
  );
}

export default App;

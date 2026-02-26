import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";

function App() {
    return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/AdminLayout" />} />
        <Route path="/AdminLayout" element={<AdminLayout category="AdminLayout" />} />
      </Routes>
    </>
  );
};

export default App;

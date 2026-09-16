import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./student/StudentDashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
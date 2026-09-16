import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./student/StudentDashboard";
import CoordinatorDashboard from "./coordinator";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/coordinator" replace />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/coordinator/*" element={<CoordinatorDashboard />} />
        <Route path="*" element={<Navigate to="/coordinator" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
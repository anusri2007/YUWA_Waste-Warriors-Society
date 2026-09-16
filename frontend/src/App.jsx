import { BrowserRouter, Routes, Route } from "react-router-dom";

// Evaluator Module
import EvaluatorDashboard from "./evaluator/pages/EvaluatorDashboard";
import Submissions from "./evaluator/pages/Submissions";
import SubmissionReview from "./evaluator/pages/SubmissionReview";
import EvaluatorAnalytics from "./evaluator/pages/EvaluatorAnalytics";
import { EvaluatorProvider } from "./evaluator/context/EvaluatorContext";

// Admin Module
import AdminDashboard from "./admin/pages/AdminDashboard";
import Colleges from "./admin/pages/Colleges";
import Coordinators from "./admin/pages/Coordinators";
import Competitions from "./admin/pages/Competitions";
import AdminReports from "./admin/pages/AdminReports";
import { AdminProvider } from "./admin/context/AdminContext";

// Student and Coordinator Modules
import StudentDashboard from "./student/StudentDashboard";
import CoordinatorDashboard from "./coordinator";

// Styles
import "./evaluator/evaluator.css";
import "./admin/admin.css";
import "./App.css";

function App() {
  return (
    <EvaluatorProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            {/* Evaluator Routes */}
            <Route path="/" element={<EvaluatorDashboard />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/submissions/:id" element={<SubmissionReview />} />
            <Route path="/analytics" element={<EvaluatorAnalytics />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/colleges" element={<Colleges />} />
            <Route path="/admin/coordinators" element={<Coordinators />} />
            <Route path="/admin/competitions" element={<Competitions />} />
            <Route path="/admin/reports" element={<AdminReports />} />

            {/* Student and Coordinator Routes */}
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/coordinator/*" element={<CoordinatorDashboard />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </EvaluatorProvider>
  );
}

export default App;
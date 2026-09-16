import { BrowserRouter, Routes, Route } from "react-router-dom";

import EvaluatorDashboard from "./evaluator/pages/EvaluatorDashboard";
import Submissions from "./evaluator/pages/Submissions";
import SubmissionReview from "./evaluator/pages/SubmissionReview";
import EvaluatorAnalytics from "./evaluator/pages/EvaluatorAnalytics";
import { EvaluatorProvider } from "./evaluator/context/EvaluatorContext";

import "./evaluator/evaluator.css";
import "./App.css";

function App() {
  return (
    <EvaluatorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EvaluatorDashboard />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/submissions/:id" element={<SubmissionReview />} />
          <Route path="/analytics" element={<EvaluatorAnalytics />} />
        </Routes>
      </BrowserRouter>
    </EvaluatorProvider>
  );
}

export default App;
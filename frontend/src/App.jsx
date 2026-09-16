import { useState } from "react";

import EvaluatorDashboard from "./evaluator/pages/EvaluatorDashboard";
import Submissions from "./evaluator/pages/Submissions";

import "./evaluator/evaluator.css";
import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      {page === "dashboard" && (
        <EvaluatorDashboard onNavigate={setPage} />
      )}

      {page === "submissions" && (
        <Submissions />
      )}
    </>
  );
}

export default App;
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { useEvaluator } from "../context/EvaluatorContext";

function EvaluatorAnalytics() {
  const navigate = useNavigate();
  const { submissions, stats } = useEvaluator();

  // Category Breakdown
  const categoryMap = {};
  submissions.forEach((sub) => {
    const cat = sub.category || "General";
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        category: cat,
        total: 0,
        evaluated: 0,
        pending: 0,
        rejected: 0,
        scores: [],
      };
    }
    categoryMap[cat].total += 1;
    if (sub.status === "evaluated") {
      categoryMap[cat].evaluated += 1;
      if (sub.evaluation?.totalScore) {
        categoryMap[cat].scores.push(sub.evaluation.totalScore);
      }
    } else if (sub.status === "pending") {
      categoryMap[cat].pending += 1;
    } else if (sub.status === "rejected") {
      categoryMap[cat].rejected += 1;
    }
  });

  const categories = Object.values(categoryMap).map((cat) => ({
    ...cat,
    avgScore:
      cat.scores.length > 0
        ? Math.round(cat.scores.reduce((a, b) => a + b, 0) / cat.scores.length)
        : null,
  }));

  // College Breakdown
  const collegeMap = {};
  submissions.forEach((sub) => {
    const coll = sub.college;
    if (!collegeMap[coll]) {
      collegeMap[coll] = { college: coll, total: 0, evaluated: 0, pending: 0, rejected: 0 };
    }
    collegeMap[coll].total += 1;
    if (sub.status === "evaluated") collegeMap[coll].evaluated += 1;
    if (sub.status === "pending") collegeMap[coll].pending += 1;
    if (sub.status === "rejected") collegeMap[coll].rejected += 1;
  });
  const colleges = Object.values(collegeMap);

  // Score brackets for evaluated submissions
  const evaluatedSubs = submissions.filter((s) => s.status === "evaluated" && s.evaluation?.totalScore);
  const scoreBrackets = {
    top: evaluatedSubs.filter((s) => s.evaluation.totalScore >= 90).length,
    high: evaluatedSubs.filter((s) => s.evaluation.totalScore >= 80 && s.evaluation.totalScore < 90).length,
    medium: evaluatedSubs.filter((s) => s.evaluation.totalScore >= 70 && s.evaluation.totalScore < 80).length,
    low: evaluatedSubs.filter((s) => s.evaluation.totalScore < 70).length,
  };

  // Recent evaluation activity
  const recentActivities = [
    ...submissions
      .filter((s) => s.status === "evaluated")
      .map((s) => ({
        id: s.id,
        team: s.team,
        college: s.college,
        task: s.task,
        type: "evaluated",
        score: s.score,
        date: s.evaluation?.evaluatedAt || s.submitted,
        evaluator: s.evaluation?.evaluatorName || "Evaluator",
      })),
    ...submissions
      .filter((s) => s.status === "rejected")
      .map((s) => ({
        id: s.id,
        team: s.team,
        college: s.college,
        task: s.task,
        type: "rejected",
        reason: s.rejection?.reason || "Guidelines mismatch",
        date: s.rejection?.rejectedAt || s.submitted,
        evaluator: s.rejection?.evaluatorName || "Evaluator",
      })),
  ];

  return (
    <div className="evaluator-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Header />

        <section className="analytics-page">
          {/* PAGE HEADER */}
          <div className="submissions-page-header">
            <div>
              <span className="workspace-label">Evaluator Portal</span>
              <h1>Evaluation Analytics & Insights</h1>
              <p>
                Comprehensive overview of submissions, review progress, task distributions, and evaluation performance.
              </p>
            </div>

            <div className="header-quick-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate("/submissions")}
              >
                Go to Submissions →
              </button>
            </div>
          </div>

          {/* KPI STAT CARDS */}
          <div className="stats-grid">
            <StatCard
              title="Assigned Submissions"
              value={stats.totalAssigned}
              icon="📋"
              description="Total submissions in your queue"
            />
            <StatCard
              title="Evaluated Submissions"
              value={stats.evaluatedCount}
              icon="✅"
              description={`${stats.completionRate}% completion rate`}
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pendingCount}
              icon="⏳"
              description="Submissions requiring action"
            />
            <StatCard
              title="Average Score"
              value={stats.averageScore ? `${stats.averageScore}/100` : "N/A"}
              icon="🏆"
              description="Mean score across evaluated"
            />
          </div>

          {/* TWO COLUMN SUMMARY GRIDS */}
          <div className="analytics-dual-grid">
            {/* STATUS BREAKDOWN & PROGRESS */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h3>Evaluation Workflow Progress</h3>
                  <p>Distribution of submissions by evaluation stage</p>
                </div>
                <span className="status-badge evaluated">
                  {stats.completionRate}% Processed
                </span>
              </div>

              {/* Progress visual bar */}
              <div className="distribution-bar-wrapper">
                <div className="distribution-bar">
                  <div
                    className="bar-segment evaluated"
                    style={{
                      width: `${(stats.evaluatedCount / (stats.totalAssigned || 1)) * 100}%`,
                    }}
                    title={`Evaluated: ${stats.evaluatedCount}`}
                  />
                  <div
                    className="bar-segment pending"
                    style={{
                      width: `${(stats.pendingCount / (stats.totalAssigned || 1)) * 100}%`,
                    }}
                    title={`Pending: ${stats.pendingCount}`}
                  />
                  <div
                    className="bar-segment rejected"
                    style={{
                      width: `${(stats.rejectedCount / (stats.totalAssigned || 1)) * 100}%`,
                    }}
                    title={`Rejected: ${stats.rejectedCount}`}
                  />
                </div>

                <div className="distribution-legend">
                  <div className="legend-item">
                    <span className="legend-dot evaluated" />
                    <span>Evaluated ({stats.evaluatedCount})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot pending" />
                    <span>Pending ({stats.pendingCount})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot rejected" />
                    <span>Rejected ({stats.rejectedCount})</span>
                  </div>
                </div>
              </div>

              {/* Score Bracket Bars */}
              <div className="score-bracket-section">
                <h4>Score Range Distribution</h4>
                <div className="bracket-list">
                  <div className="bracket-row">
                    <span className="bracket-label">90 - 100 (Exemplary)</span>
                    <div className="bracket-bar-container">
                      <div
                        className="bracket-bar"
                        style={{
                          width: `${(scoreBrackets.top / (evaluatedSubs.length || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="bracket-count">{scoreBrackets.top}</span>
                  </div>
                  <div className="bracket-row">
                    <span className="bracket-label">80 - 89 (Proficient)</span>
                    <div className="bracket-bar-container">
                      <div
                        className="bracket-bar"
                        style={{
                          width: `${(scoreBrackets.high / (evaluatedSubs.length || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="bracket-count">{scoreBrackets.high}</span>
                  </div>
                  <div className="bracket-row">
                    <span className="bracket-label">70 - 79 (Developing)</span>
                    <div className="bracket-bar-container">
                      <div
                        className="bracket-bar"
                        style={{
                          width: `${(scoreBrackets.medium / (evaluatedSubs.length || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="bracket-count">{scoreBrackets.medium}</span>
                  </div>
                  <div className="bracket-row">
                    <span className="bracket-label">&lt; 70 (Needs Work)</span>
                    <div className="bracket-bar-container">
                      <div
                        className="bracket-bar"
                        style={{
                          width: `${(scoreBrackets.low / (evaluatedSubs.length || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="bracket-count">{scoreBrackets.low}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLLEGE LEVEL BREAKDOWN */}
            <div className="analytics-card">
              <div className="analytics-card-header">
                <div>
                  <h3>Participating Colleges</h3>
                  <p>Submissions submitted by institutional partners</p>
                </div>
                <span className="tag-pill">{colleges.length} Colleges</span>
              </div>

              <div className="analytics-table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>College</th>
                      <th>Total</th>
                      <th>Evaluated</th>
                      <th>Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colleges.map((c) => (
                      <tr key={c.college}>
                        <td className="font-semibold">{c.college}</td>
                        <td>{c.total}</td>
                        <td>
                          <span className="mini-badge evaluated">{c.evaluated}</span>
                        </td>
                        <td>
                          <span className="mini-badge pending">{c.pending}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* TASK CATEGORY BREAKDOWN */}
          <div className="analytics-card mt-24">
            <div className="analytics-card-header">
              <div>
                <h3>Environmental Task Categories</h3>
                <p>Metrics grouped by waste and sustainability challenge categories</p>
              </div>
            </div>

            <div className="categories-grid">
              {categories.map((cat) => (
                <div className="category-metric-card" key={cat.category}>
                  <div className="category-top">
                    <h4>{cat.category}</h4>
                    <span className="tag-pill">{cat.total} Submissions</span>
                  </div>

                  <div className="category-stats">
                    <div className="cat-stat">
                      <span>Evaluated</span>
                      <strong>{cat.evaluated}</strong>
                    </div>
                    <div className="cat-stat">
                      <span>Pending</span>
                      <strong>{cat.pending}</strong>
                    </div>
                    <div className="cat-stat">
                      <span>Avg Score</span>
                      <strong>{cat.avgScore ? `${cat.avgScore}/100` : "--"}</strong>
                    </div>
                  </div>

                  <div className="category-mini-bar">
                    <div
                      className="category-mini-fill"
                      style={{
                        width: `${(cat.evaluated / cat.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT EVALUATION AUDIT LOG */}
          <div className="analytics-card mt-24">
            <div className="analytics-card-header">
              <div>
                <h3>Evaluation Log</h3>
                <p>History of finalized reviews and rejected submissions</p>
              </div>
            </div>

            {recentActivities.length === 0 ? (
              <div className="empty-state">
                <p>No evaluation actions completed yet.</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivities.map((act) => (
                  <div className="activity-item" key={`${act.type}-${act.id}`}>
                    <div className={`activity-icon ${act.type}`}>
                      {act.type === "evaluated" ? "✓" : "✕"}
                    </div>

                    <div className="activity-details">
                      <div className="activity-line">
                        <strong>{act.team}</strong>
                        <span className="activity-college">({act.college})</span>
                        <span className={`status-badge ${act.type}`}>
                          {act.type === "evaluated" ? `Score: ${act.score}` : "Rejected"}
                        </span>
                      </div>
                      <p className="activity-task">
                        {act.task} • {act.type === "rejected" ? `Reason: ${act.reason}` : `Reviewed by ${act.evaluator}`}
                      </p>
                    </div>

                    <div className="activity-right">
                      <span className="activity-time">{act.date}</span>
                      <button
                        className="btn-view-link"
                        onClick={() => navigate(`/submissions/${act.id}`)}
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default EvaluatorAnalytics;

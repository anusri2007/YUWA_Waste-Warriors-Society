import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEvaluator } from "../context/EvaluatorContext";

function Submissions() {
  const navigate = useNavigate();
  const { submissions } = useEvaluator();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState("all");

  // Extract unique categories and colleges for filter dropdown
  const categories = useMemo(() => {
    const set = new Set(submissions.map((s) => s.category || "General"));
    return ["all", ...Array.from(set)];
  }, [submissions]);

  const colleges = useMemo(() => {
    const set = new Set(submissions.map((s) => s.college));
    return ["all", ...Array.from(set)];
  }, [submissions]);

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesTab =
        activeTab === "all" || submission.status === activeTab;

      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        !searchText ||
        submission.team.toLowerCase().includes(searchText) ||
        submission.college.toLowerCase().includes(searchText) ||
        submission.task.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "all" ||
        submission.category === selectedCategory ||
        submission.task.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesCollege =
        selectedCollege === "all" || submission.college === selectedCollege;

      return matchesTab && matchesSearch && matchesCategory && matchesCollege;
    });
  }, [submissions, activeTab, search, selectedCategory, selectedCollege]);

  // Submission counts
  const counts = {
    all: submissions.length,
    pending: submissions.filter((item) => item.status === "pending").length,
    evaluated: submissions.filter((item) => item.status === "evaluated").length,
    rejected: submissions.filter((item) => item.status === "rejected").length,
  };

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) + (selectedCollege !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCollege("all");
    setSearch("");
  };

  // Handle Review / View navigation
  const handleSubmissionClick = (submission) => {
    navigate(`/submissions/${submission.id}`);
  };

  return (
    <div className="evaluator-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <Header />

        <section className="submissions-page">
          {/* PAGE HEADER */}
          <div className="submissions-page-header">
            <div>
              <span className="workspace-label">Evaluator Workspace</span>
              <h1>Submissions</h1>
              <p>
                Review and evaluate environmental tasks submitted by student teams.
              </p>
            </div>

            {activeFilterCount > 0 && (
              <div className="active-filters-bar">
                <span>Active Filters:</span>
                {selectedCategory !== "all" && (
                  <span className="filter-pill">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")}>×</button>
                  </span>
                )}
                {selectedCollege !== "all" && (
                  <span className="filter-pill">
                    College: {selectedCollege}
                    <button onClick={() => setSelectedCollege("all")}>×</button>
                  </span>
                )}
                <button className="clear-all-link" onClick={clearFilters}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* SEARCH + FILTER TOOLBAR */}
          <div className="submission-toolbar">
            {/* SEARCH */}
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search team, college or task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearch("")}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* FILTER BUTTON & DROPDOWN */}
            <div className="filter-dropdown-container">
              <button
                className={`filter-button ${activeFilterCount > 0 ? "has-filters" : ""}`}
                onClick={() => setShowFilterModal(!showFilterModal)}
              >
                Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
                <span>{showFilterModal ? "▴" : "⌄"}</span>
              </button>

              {showFilterModal && (
                <div className="filter-popover">
                  <div className="filter-popover-header">
                    <h4>Filter Submissions</h4>
                    <button
                      className="popover-close"
                      onClick={() => setShowFilterModal(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="filter-field">
                    <label>Task Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {categories
                        .filter((c) => c !== "all")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="filter-field">
                    <label>College / University</label>
                    <select
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                    >
                      <option value="all">All Colleges</option>
                      {colleges
                        .filter((c) => c !== "all")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="filter-popover-actions">
                    <button
                      className="text-btn"
                      onClick={clearFilters}
                      disabled={activeFilterCount === 0}
                    >
                      Reset
                    </button>
                    <button
                      className="apply-btn"
                      onClick={() => setShowFilterModal(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="submission-tabs">
            {/* ALL */}
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All
              <span>{counts.all}</span>
            </button>

            {/* PENDING */}
            <button
              className={activeTab === "pending" ? "active" : ""}
              onClick={() => setActiveTab("pending")}
            >
              Pending
              <span>{counts.pending}</span>
            </button>

            {/* EVALUATED */}
            <button
              className={activeTab === "evaluated" ? "active" : ""}
              onClick={() => setActiveTab("evaluated")}
            >
              Evaluated
              <span>{counts.evaluated}</span>
            </button>

            {/* REJECTED */}
            <button
              className={activeTab === "rejected" ? "active" : ""}
              onClick={() => setActiveTab("rejected")}
            >
              Rejected
              <span>{counts.rejected}</span>
            </button>
          </div>

          {/* SUBMISSION LIST */}
          <div className="full-submission-list">
            {filteredSubmissions.length === 0 ? (
              /* NO RESULTS */
              <div className="no-submissions">
                <div className="empty-icon">🔍</div>
                <h3>No submissions found</h3>
                <p>
                  Try changing your search keywords or resetting active filters.
                </p>
                {(search || activeFilterCount > 0) && (
                  <button className="reset-btn" onClick={clearFilters}>
                    Reset Search & Filters
                  </button>
                )}
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div
                  className="full-submission-card"
                  key={submission.id}
                  onClick={() => handleSubmissionClick(submission)}
                >
                  {/* TEAM */}
                  <div className="submission-team">
                    <div className="team-avatar">
                      {submission.team ? submission.team.charAt(0) : "T"}
                    </div>

                    <div>
                      <h3>{submission.team}</h3>
                      <p>{submission.college}</p>
                    </div>
                  </div>

                  {/* TASK */}
                  <div className="submission-info">
                    <span>Task</span>
                    <strong>{submission.task}</strong>
                  </div>

                  {/* SUBMITTED */}
                  <div className="submission-info">
                    <span>Submitted</span>
                    <strong>{submission.submitted || "Recently"}</strong>
                  </div>

                  {/* MEMBERS */}
                  <div className="submission-info">
                    <span>Members</span>
                    <strong>{submission.members || 1}</strong>
                  </div>

                  {/* STATUS */}
                  <div className="submission-status">
                    <span className={`status-badge ${submission.status}`}>
                      {submission.status === "pending" && "Pending"}
                      {submission.status === "evaluated" && "Evaluated"}
                      {submission.status === "rejected" && "Rejected"}
                    </span>

                    {/* SCORE OR REJECTION TAG */}
                    {submission.score && (
                      <strong className="submission-score">
                        {submission.score}
                      </strong>
                    )}
                    {submission.status === "rejected" && submission.rejection?.reason && (
                      <span className="rejection-hint" title={submission.rejection.reason}>
                        Needs Revision
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTON */}
                  <button
                    className="submission-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmissionClick(submission);
                    }}
                  >
                    {submission.status === "pending" ? "Review →" : "View →"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Submissions;
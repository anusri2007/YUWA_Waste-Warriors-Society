import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const submissionsData = [
  {
    id: 1,
    team: "Eco Warriors",
    college: "ABC College",
    task: "Waste Segregation",
    submitted: "2 hours ago",
    members: 4,
    status: "pending",
  },
  {
    id: 2,
    team: "Green Champs",
    college: "XYZ College",
    task: "Plastic Collection",
    submitted: "4 hours ago",
    members: 5,
    status: "pending",
  },
  {
    id: 3,
    team: "Earth Heroes",
    college: "DEF College",
    task: "Tree Plantation",
    submitted: "1 day ago",
    members: 4,
    status: "evaluated",
    score: "88/100",
  },
  {
    id: 4,
    team: "Clean City",
    college: "PQR College",
    task: "Community Cleanup",
    submitted: "2 days ago",
    members: 3,
    status: "rejected",
    score: "42/100",
  },
];

function Submissions() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredSubmissions = submissionsData.filter((submission) => {
    const matchesTab =
      activeTab === "all" || submission.status === activeTab;

    const searchText = search.toLowerCase();

    const matchesSearch =
      submission.team.toLowerCase().includes(searchText) ||
      submission.college.toLowerCase().includes(searchText) ||
      submission.task.toLowerCase().includes(searchText);

    return matchesTab && matchesSearch;
  });

  const counts = {
    all: submissionsData.length,
    pending: submissionsData.filter(
      (item) => item.status === "pending"
    ).length,
    evaluated: submissionsData.filter(
      (item) => item.status === "evaluated"
    ).length,
    rejected: submissionsData.filter(
      (item) => item.status === "rejected"
    ).length,
  };

  return (
    <div className="evaluator-layout">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <main className="main-content">

        {/* HEADER */}
        <Header />

        <section className="submissions-page">

          {/* PAGE HEADER */}
          <div className="submissions-page-header">
            <div>
              <span className="workspace-label">
                Evaluator Workspace
              </span>

              <h1>Submissions</h1>

              <p>
                Review and evaluate environmental tasks submitted by
                student teams.
              </p>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="submission-toolbar">

            <div className="search-box">

              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search team, college or task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <button className="filter-button">
              Filter
              <span>⌄</span>
            </button>

          </div>

          {/* TABS */}
          <div className="submission-tabs">

            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All
              <span>{counts.all}</span>
            </button>

            <button
              className={activeTab === "pending" ? "active" : ""}
              onClick={() => setActiveTab("pending")}
            >
              Pending
              <span>{counts.pending}</span>
            </button>

            <button
              className={activeTab === "evaluated" ? "active" : ""}
              onClick={() => setActiveTab("evaluated")}
            >
              Evaluated
              <span>{counts.evaluated}</span>
            </button>

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

            {filteredSubmissions.map((submission) => (

              <div
                className="full-submission-card"
                key={submission.id}
              >

                {/* TEAM */}
                <div className="submission-team">

                  <div className="team-avatar">
                    {submission.team.charAt(0)}
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
                  <strong>{submission.submitted}</strong>
                </div>

                {/* MEMBERS */}
                <div className="submission-info">
                  <span>Members</span>
                  <strong>{submission.members}</strong>
                </div>

                {/* STATUS */}
                <div className="submission-status">

                  <span
                    className={`status-badge ${submission.status}`}
                  >
                    {submission.status === "pending" && "Pending"}
                    {submission.status === "evaluated" && "Evaluated"}
                    {submission.status === "rejected" && "Rejected"}
                  </span>

                  {submission.score && (
                    <strong className="submission-score">
                      {submission.score}
                    </strong>
                  )}

                </div>

                {/* ACTION */}
                <button className="submission-action">

                  {submission.status === "pending"
                    ? "Review →"
                    : "View →"}

                </button>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Submissions;
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAdmin } from "../context/AdminContext";

function AdminReports() {
  const {
    colleges,
    coordinators,
    teams,
    submissions,
    competitions,
    statistics,
  } = useAdmin();

  // 1. Environmental Task Distribution from Submissions
  const taskDistribution = {};
  submissions.forEach((sub) => {
    let cat = "Other Waste Initiative";
    const t = sub.task.toLowerCase();
    if (t.includes("segregation") || t.includes("compost")) {
      cat = "Waste Segregation & Composting";
    } else if (t.includes("plastic")) {
      cat = "Plastic Collection & Elimination";
    } else if (t.includes("tree") || t.includes("plantation")) {
      cat = "Tree Plantation & Green Cover";
    } else if (t.includes("cleanup") || t.includes("cleanliness")) {
      cat = "Community Cleanliness Drives";
    } else if (t.includes("e-waste") || t.includes("electronic")) {
      cat = "E-Waste Safe Disposal";
    }

    if (!taskDistribution[cat]) {
      taskDistribution[cat] = { count: 0, evaluated: 0, pending: 0, rejected: 0 };
    }
    taskDistribution[cat].count += 1;
    if (sub.status === "evaluated") taskDistribution[cat].evaluated += 1;
    else if (sub.status === "pending") taskDistribution[cat].pending += 1;
    else if (sub.status === "rejected") taskDistribution[cat].rejected += 1;
  });

  const taskStats = Object.entries(taskDistribution).map(([name, data]) => ({
    name,
    ...data,
    percentage: Math.round((data.count / (submissions.length || 1)) * 100),
  }));

  // 2. College Participation Metrics
  const activeColleges = colleges.filter((c) => c.status === "Active").length;
  const collegesWithCoordinators = colleges.filter(
    (c) => c.assignedCoordinator && c.assignedCoordinator !== "Unassigned"
  ).length;

  // 3. Coordinator Status Distribution
  const approvedCoords = coordinators.filter((c) => c.status === "Approved").length;
  const pendingCoords = coordinators.filter((c) => c.status === "Pending").length;
  const rejectedCoords = coordinators.filter((c) => c.status === "Rejected").length;

  // 4. Competition Status Distribution
  const activeComps = competitions.filter((c) => c.status === "Active").length;
  const upcomingComps = competitions.filter((c) => c.status === "Upcoming").length;
  const completedComps = competitions.filter((c) => c.status === "Completed").length;
  const draftComps = competitions.filter((c) => c.status === "Draft").length;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader
          title="Reports & Analytics"
          subtitle="Platform Metrics & Program Intelligence"
        />

        <div className="admin-content">
          {/* PAGE HEADER */}
          <div className="admin-page-header">
            <div>
              <span className="admin-workspace-label">Program Analytics</span>
              <h1>YUWA Society Comprehensive Impact Report</h1>
              <p>
                Consolidated data on institutional participation, student engagement, task categories, and competition progress.
              </p>
            </div>

            <div className="admin-table-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => window.print()}
                title="Print or export current report"
              >
                🖨️ Print / Export Summary
              </button>
            </div>
          </div>

          {/* KPI METRICS OVERVIEW (6 Cards) */}
          <div className="admin-stats-grid">
            <StatCard
              title="Total Institutions"
              value={statistics.totalColleges}
              icon="🏛️"
              description={`${activeColleges} active partner campuses`}
            />
            <StatCard
              title="Faculty Coordinators"
              value={statistics.totalCoordinators}
              icon="👥"
              description={`${pendingCoords} verification pending`}
            />
            <StatCard
              title="Enrolled Students"
              value={statistics.totalStudents}
              icon="🎓"
              description="Direct & collegiate volunteers"
            />
            <StatCard
              title="Action Teams"
              value={statistics.totalTeams}
              icon="⚡"
              description={`${teams.length} registered squads`}
            />
            <StatCard
              title="Task Submissions"
              value={statistics.totalSubmissions}
              icon="📋"
              description="Action proofs documented"
            />
            <StatCard
              title="Active Competitions"
              value={activeComps}
              icon="🏆"
              description={`${competitions.length} challenges published`}
            />
          </div>

          {/* DUAL COLUMN: SUBMISSIONS BY TASK & COORDINATOR BREAKDOWN */}
          <div className="admin-dashboard-dual">
            {/* SUBMISSIONS BY TASK BREAKDOWN */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <div>
                  <h3>Submissions by Environmental Category</h3>
                  <p>Distribution of student action across challenge categories</p>
                </div>
                <span className="admin-status-badge badge-neutral">
                  {submissions.length} Submissions Total
                </span>
              </div>

              <div>
                {taskStats.map((task) => (
                  <div className="admin-progress-container" key={task.name}>
                    <div className="admin-progress-header">
                      <strong>{task.name}</strong>
                      <span>
                        {task.count} proofs ({task.percentage}%)
                      </span>
                    </div>
                    <div className="admin-progress-track">
                      <div
                        className="admin-progress-fill"
                        style={{ width: `${task.percentage}%` }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "11px",
                        color: "#71817c",
                        marginTop: "4px",
                      }}
                    >
                      <span style={{ color: "#177345" }}>✓ {task.evaluated} Evaluated</span>
                      <span style={{ color: "#a76b00" }}>⏳ {task.pending} Pending</span>
                      {task.rejected > 0 && (
                        <span style={{ color: "#c9363f" }}>✕ {task.rejected} Rejected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COORDINATOR APPROVAL RATIO & STATUSES */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <div>
                  <h3>Coordinator Pipeline & Governance</h3>
                  <p>Institutional supervision coverage across campuses</p>
                </div>
                <span className="admin-status-badge badge-success">
                  {Math.round((collegesWithCoordinators / (colleges.length || 1)) * 100)}% Coverage
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div style={{ background: "#def5e8", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#177345" }}>
                      {approvedCoords}
                    </div>
                    <div style={{ fontSize: "11px", color: "#246d40", fontWeight: 600 }}>Approved Leads</div>
                  </div>

                  <div style={{ background: "#fff3d8", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#a76b00" }}>
                      {pendingCoords}
                    </div>
                    <div style={{ fontSize: "11px", color: "#8a5800", fontWeight: 600 }}>Under Review</div>
                  </div>

                  <div style={{ background: "#ffe3e5", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#c9363f" }}>
                      {rejectedCoords}
                    </div>
                    <div style={{ fontSize: "11px", color: "#a6242c", fontWeight: 600 }}>Declined</div>
                  </div>
                </div>

                <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#648078", fontWeight: 700, marginBottom: "8px" }}>
                    INSTITUTIONAL SUPERVISION SUMMARY
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#384d43", lineHeight: 1.6 }}>
                    <li><strong>{collegesWithCoordinators} of {colleges.length}</strong> colleges have an assigned verified coordinator.</li>
                    <li>Average squad supervision: <strong>{Math.round((teams.length / (approvedCoords || 1)) * 10) / 10} teams per coordinator</strong>.</li>
                    <li>Coordinator response turnaround average: <strong>&lt; 24 hours</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* COLLEGE PERFORMANCE & ENROLLMENT TABLE */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3>College Engagement & Squad Activity</h3>
                <p>Institutional breakdown of student quotas and registered teams</p>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Institution Name</th>
                    <th>Location</th>
                    <th>Students Enrolled</th>
                    <th>Active Teams</th>
                    <th>Supervising Coordinator</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((col) => (
                    <tr key={col.id}>
                      <td>
                        <strong>{col.name}</strong>
                      </td>
                      <td>{col.location}</td>
                      <td>
                        <strong style={{ color: "#197642" }}>{col.studentsCount || 0}</strong> Students
                      </td>
                      <td>{col.teamsCount || 0} Squads</td>
                      <td>
                        {col.assignedCoordinator === "Unassigned" ? (
                          <span style={{ color: "#a76b00", fontSize: "12px", fontWeight: 600 }}>
                            ⚠ Unassigned
                          </span>
                        ) : (
                          col.assignedCoordinator
                        )}
                      </td>
                      <td>
                        <StatusBadge status={col.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMPETITION LIFECYCLE BREAKDOWN */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3>Competition Campaign Lifecycle</h3>
                <p>State of scheduled, live, and archived environmental competitions</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "10px", border: "1px solid #edf2ef" }}>
                <div style={{ fontSize: "12px", color: "#648078", marginBottom: "4px" }}>ACTIVE NOW</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#197642" }}>{activeComps}</div>
                <div style={{ fontSize: "12px", color: "#648078" }}>Currently receiving submissions</div>
              </div>

              <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "10px", border: "1px solid #edf2ef" }}>
                <div style={{ fontSize: "12px", color: "#648078", marginBottom: "4px" }}>UPCOMING</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#e59d18" }}>{upcomingComps}</div>
                <div style={{ fontSize: "12px", color: "#648078" }}>Pre-registration phase</div>
              </div>

              <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "10px", border: "1px solid #edf2ef" }}>
                <div style={{ fontSize: "12px", color: "#648078", marginBottom: "4px" }}>COMPLETED</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#10251d" }}>{completedComps}</div>
                <div style={{ fontSize: "12px", color: "#648078" }}>Archived with verified scores</div>
              </div>

              <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "10px", border: "1px solid #edf2ef" }}>
                <div style={{ fontSize: "12px", color: "#648078", marginBottom: "4px" }}>DRAFT</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#71817c" }}>{draftComps}</div>
                <div style={{ fontSize: "12px", color: "#648078" }}>In preparation by admin</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminReports;

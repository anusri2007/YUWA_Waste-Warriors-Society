import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAdmin } from "../context/AdminContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    colleges,
    coordinators,
    competitions,
    submissions,
    statistics,
    approveCoordinator,
    rejectCoordinator,
  } = useAdmin();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (coord) => {
    approveCoordinator(coord.id);
    showToast(`Coordinator "${coord.name}" approved successfully.`);
  };

  const handleReject = (coord) => {
    if (window.confirm(`Are you sure you want to reject coordinator request from ${coord.name}?`)) {
      rejectCoordinator(coord.id, "Criteria requirements not fulfilled");
      showToast(`Coordinator "${coord.name}" request rejected.`);
    }
  };

  const pendingCoordinators = coordinators.filter((c) => c.status === "Pending");
  const recentColleges = colleges.slice(0, 4);
  const activeCompetitions = competitions.filter((c) => c.status === "Active" || c.status === "Upcoming").slice(0, 3);
  const recentSubmissions = submissions.slice(0, 4);

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <main className="admin-main">
        <AdminHeader title="Executive Overview" subtitle="Admin Control Center" />

        <div className="admin-content">
          {/* TOAST */}
          {toastMessage && (
            <div className="admin-toast">
              <span>✓</span>
              {toastMessage}
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="admin-page-header">
            <div>
              <span className="admin-workspace-label">System Administration</span>
              <h1>YUWA Society Operations Dashboard</h1>
              <p>
                Manage collegiate partnerships, coordinator approvals, nationwide environmental challenges, and submissions.
              </p>
            </div>

            <div className="admin-table-actions">
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => navigate("/admin/colleges")}
              >
                + Register College
              </button>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate("/admin/competitions")}
              >
                + New Competition
              </button>
            </div>
          </div>

          {/* KPI STATISTICS GRID (6 Cards) */}
          <div className="admin-stats-grid">
            <StatCard
              title="Total Colleges"
              value={statistics.totalColleges}
              icon="🏛️"
              description="Institutions registered"
            />
            <StatCard
              title="Approved Coordinators"
              value={statistics.totalCoordinators}
              icon="👥"
              description="Faculty leads active"
            />
            <StatCard
              title="Total Students"
              value={statistics.totalStudents}
              icon="🎓"
              description="Active participants"
            />
            <StatCard
              title="Active Teams"
              value={statistics.totalTeams}
              icon="⚡"
              description="Registered squads"
            />
            <StatCard
              title="Total Submissions"
              value={statistics.totalSubmissions}
              icon="📋"
              description="Completed task proofs"
            />
            <StatCard
              title="Pending Requests"
              value={statistics.pendingRequests}
              icon="⏳"
              description="Coordinators awaiting review"
              badge={
                statistics.pendingRequests > 0 ? (
                  <span className="admin-status-badge badge-warning">Action Required</span>
                ) : (
                  <span className="admin-status-badge badge-success">All Clear</span>
                )
              }
            />
          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h2>Quick Management Shortcuts</h2>
                <p>Direct access to primary administrative workflows</p>
              </div>
            </div>

            <div className="admin-quick-actions-bar">
              <div
                className="quick-action-card"
                onClick={() => navigate("/admin/colleges")}
              >
                <div className="quick-action-icon">🏛️</div>
                <div className="quick-action-info">
                  <strong>Manage Colleges</strong>
                  <span>View, register, and assign coordinators</span>
                </div>
              </div>

              <div
                className="quick-action-card"
                onClick={() => navigate("/admin/coordinators")}
              >
                <div className="quick-action-icon">👥</div>
                <div className="quick-action-info">
                  <strong>Coordinator Approvals</strong>
                  <span>{statistics.pendingRequests} pending verification</span>
                </div>
              </div>

              <div
                className="quick-action-card"
                onClick={() => navigate("/admin/competitions")}
              >
                <div className="quick-action-icon">🏆</div>
                <div className="quick-action-info">
                  <strong>Host Competitions</strong>
                  <span>Configure categories, rules, and dates</span>
                </div>
              </div>

              <div
                className="quick-action-card"
                onClick={() => navigate("/admin/reports")}
              >
                <div className="quick-action-icon">📈</div>
                <div className="quick-action-info">
                  <strong>View Analytics & Reports</strong>
                  <span>Institutional and category performance</span>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL COLUMN: PENDING COORDINATOR REQUESTS & RECENT COLLEGES */}
          <div className="admin-dashboard-dual">
            {/* RECENT COORDINATOR REQUESTS */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <div>
                  <h3>Pending Coordinator Requests</h3>
                  <p>Faculty and volunteer coordinators seeking approval</p>
                </div>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => navigate("/admin/coordinators")}
                >
                  View All ({coordinators.length}) →
                </button>
              </div>

              {pendingCoordinators.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">✓</div>
                  <h3>No pending requests</h3>
                  <p>All coordinator applications have been reviewed.</p>
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Coordinator</th>
                        <th>College</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCoordinators.map((coord) => (
                        <tr key={coord.id}>
                          <td>
                            <strong>{coord.name}</strong>
                            <div style={{ fontSize: "11px", color: "#648078" }}>{coord.email}</div>
                          </td>
                          <td>{coord.college}</td>
                          <td>
                            <StatusBadge status={coord.status} />
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                className="admin-btn admin-btn-primary admin-btn-sm"
                                onClick={() => handleApprove(coord)}
                              >
                                Approve
                              </button>
                              <button
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => handleReject(coord)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* RECENT REGISTERED COLLEGES */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <div>
                  <h3>Partner Colleges</h3>
                  <p>Institutions participating in YUWA campaigns</p>
                </div>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => navigate("/admin/colleges")}
                >
                  Manage Colleges ({colleges.length}) →
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Institution</th>
                      <th>Location</th>
                      <th>Coordinator</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentColleges.map((col) => (
                      <tr key={col.id}>
                        <td>
                          <strong>{col.name}</strong>
                          <div style={{ fontSize: "11px", color: "#648078" }}>
                            {col.studentsCount} Students • {col.teamsCount} Teams
                          </div>
                        </td>
                        <td>{col.location}</td>
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
          </div>

          {/* DUAL COLUMN: RECENT COMPETITIONS & RECENT SUBMISSION ACTIVITY */}
          <div className="admin-dashboard-dual">
            {/* ONGOING & UPCOMING COMPETITIONS */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <div>
                  <h3>Active & Upcoming Competitions</h3>
                  <p>Environmental challenges open to student teams</p>
                </div>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => navigate("/admin/competitions")}
                >
                  All Competitions ({competitions.length}) →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeCompetitions.map((comp) => (
                  <div
                    key={comp.id}
                    style={{
                      padding: "14px",
                      background: "#fbfdfc",
                      border: "1px solid #edf2ef",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "14px", color: "#10251d" }}>{comp.title}</strong>
                        <StatusBadge status={comp.status} />
                      </div>
                      <span style={{ fontSize: "12px", color: "#648078" }}>
                        Category: {comp.category} • Timeline: {comp.startDate} to {comp.endDate}
                      </span>
                    </div>

                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => navigate("/admin/competitions")}
                    >
                      Inspect →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT SUBMISSION ACTIVITY */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <div>
                  <h3>Recent Task Submissions</h3>
                  <p>Environmental work submitted by student squads</p>
                </div>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => navigate("/admin/reports")}
                >
                  Detailed Reports →
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Team & College</th>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <strong>{sub.team}</strong>
                          <div style={{ fontSize: "11px", color: "#648078" }}>{sub.college}</div>
                        </td>
                        <td>{sub.task}</td>
                        <td>
                          <StatusBadge status={sub.status} />
                        </td>
                        <td style={{ fontSize: "12px", color: "#71817c" }}>{sub.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

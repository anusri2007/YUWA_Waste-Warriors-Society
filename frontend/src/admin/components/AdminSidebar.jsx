import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { statistics } = useAdmin();

  return (
    <aside className="admin-sidebar">
      {/* BRAND */}
      <div className="admin-brand" onClick={() => navigate("/admin")}>
        <div className="admin-brand-logo">🛡️</div>
        <div>
          <h2>YUWA</h2>
          <span>Admin Portal</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="admin-sidebar-nav">
        <button
          className={`admin-nav-item ${
            location.pathname === "/admin" ? "active" : ""
          }`}
          onClick={() => navigate("/admin")}
        >
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </button>

        <button
          className={`admin-nav-item ${
            location.pathname.startsWith("/admin/colleges") ? "active" : ""
          }`}
          onClick={() => navigate("/admin/colleges")}
        >
          <span className="nav-icon">🏛️</span>
          <span>Colleges</span>
        </button>

        <button
          className={`admin-nav-item ${
            location.pathname.startsWith("/admin/coordinators") ? "active" : ""
          }`}
          onClick={() => navigate("/admin/coordinators")}
        >
          <span className="nav-icon">👥</span>
          <span>Coordinators</span>
          {statistics.pendingRequests > 0 && (
            <span className="admin-nav-badge">{statistics.pendingRequests}</span>
          )}
        </button>

        <button
          className={`admin-nav-item ${
            location.pathname.startsWith("/admin/competitions") ? "active" : ""
          }`}
          onClick={() => navigate("/admin/competitions")}
        >
          <span className="nav-icon">🏆</span>
          <span>Competitions</span>
        </button>

        <button
          className={`admin-nav-item ${
            location.pathname.startsWith("/admin/reports") ? "active" : ""
          }`}
          onClick={() => navigate("/admin/reports")}
        >
          <span className="nav-icon">📈</span>
          <span>Reports & Analytics</span>
        </button>
      </nav>

      {/* SIDEBAR BOTTOM */}
      <div className="admin-sidebar-bottom">
        <button
          className="admin-nav-item switch-role-btn"
          onClick={() => navigate("/")}
          title="Switch to Evaluator Workspace"
        >
          <span className="nav-icon">🌱</span>
          <span>Evaluator Portal</span>
        </button>

        <button
          className="admin-nav-item logout"
          onClick={() => {
            if (window.confirm("Are you sure you want to log out of the Admin Portal?")) {
              navigate("/admin");
            }
          }}
        >
          <span className="nav-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;


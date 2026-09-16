import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-logo">🌱</div>

        <div>
          <h2>YUWA</h2>
          <span>Ecolympics</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        <button
          className={`nav-item ${
            location.pathname === "/" ? "active" : ""
          }`}
          onClick={() => navigate("/")}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className={`nav-item ${
            location.pathname.startsWith("/submissions") ? "active" : ""
          }`}
          onClick={() => navigate("/submissions")}
        >
          <span>▣</span>
          Submissions
        </button>

        <button
          className={`nav-item ${
            location.pathname === "/analytics" ? "active" : ""
          }`}
          onClick={() => navigate("/analytics")}
        >
          <span>◈</span>
          Analytics
        </button>

      </nav>

      <div className="sidebar-bottom">

        <button
          className="nav-item"
          onClick={() => alert("Evaluator settings: Notification preferences & profile management.")}
        >
          <span>⚙</span>
          Settings
        </button>

        <button
          className="nav-item logout"
          onClick={() => {
            if (window.confirm("Are you sure you want to log out of the Evaluator Portal?")) {
              navigate("/");
            }
          }}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
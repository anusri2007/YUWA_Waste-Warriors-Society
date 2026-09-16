function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="brand">

        <div className="brand-logo">
          🌱
        </div>

        <div>
          <h2>YUWA</h2>
          <span>Ecolympics</span>
        </div>

      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <button
          className={`nav-item ${
            activePage === "dashboard" ? "active" : ""
          }`}
          onClick={() => onNavigate("dashboard")}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className={`nav-item ${
            activePage === "submissions" ? "active" : ""
          }`}
          onClick={() => onNavigate("submissions")}
        >
          <span>▣</span>
          Submissions
        </button>

        <button
          className={`nav-item ${
            activePage === "analytics" ? "active" : ""
          }`}
          onClick={() => onNavigate("analytics")}
        >
          <span>◈</span>
          Analytics
        </button>

      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <button className="nav-item">
          <span>⚙</span>
          Settings
        </button>

        <button className="nav-item logout">
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
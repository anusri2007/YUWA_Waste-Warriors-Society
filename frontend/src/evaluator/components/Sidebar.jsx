function Sidebar() {
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
        <button className="nav-item active">
          <span>⌂</span>
          Dashboard
        </button>

        <button className="nav-item">
          <span>▣</span>
          Submissions
        </button>

        <button className="nav-item">
          <span>◈</span>
          Analytics
        </button>
      </nav>

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
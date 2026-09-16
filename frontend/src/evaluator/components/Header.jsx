function Header() {
  return (
    <header className="header">
      <div>
        <p className="welcome-text">Welcome back</p>
        <h1>Evaluator Dashboard</h1>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          🔔
        </button>

        <div className="profile">
          <div className="profile-avatar">E</div>

          <div>
            <strong>Evaluator</strong>
            <span>YUWA Team</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
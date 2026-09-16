import { useState } from "react";
import { useEvaluator } from "../context/EvaluatorContext";

function Header({ title = "Evaluator Dashboard", subtitle = "Welcome back" }) {
  const { stats } = useEvaluator();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <div>
        <p className="welcome-text">{subtitle}</p>
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            🔔
            {stats.pendingCount > 0 && (
              <span className="notification-badge">{stats.pendingCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <strong>Notifications</strong>
                <span>{stats.pendingCount} pending review</span>
              </div>
              <div className="notification-body">
                <p>
                  You have <strong>{stats.pendingCount}</strong> student submission
                  {stats.pendingCount === 1 ? "" : "s"} waiting for evaluation.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="profile">
          <div className="profile-avatar">E</div>

          <div>
            <strong>Evaluator</strong>
            <span>YUWA Society</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
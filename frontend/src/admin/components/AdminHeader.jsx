import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

function AdminHeader({ title = "Admin Dashboard", subtitle = "Welcome, Administrator" }) {
  const navigate = useNavigate();
  const { statistics, coordinators } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingCoordinators = coordinators.filter((c) => c.status === "Pending");

  return (
    <header className="admin-header">
      <div>
        <p className="admin-welcome-text">{subtitle}</p>
        <h1>{title}</h1>
      </div>

      <div className="admin-header-actions">
        {/* NOTIFICATIONS */}
        <div className="admin-notification-wrapper">
          <button
            className="admin-notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Coordinator Approvals & Alerts"
          >
            🔔
            {statistics.pendingRequests > 0 && (
              <span className="admin-notification-badge">
                {statistics.pendingRequests}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="admin-notification-dropdown">
              <div className="admin-dropdown-header">
                <strong>Pending Actions</strong>
                <span>{statistics.pendingRequests} Requests</span>
              </div>

              <div className="admin-dropdown-body">
                {pendingCoordinators.length === 0 ? (
                  <p className="empty-notif">No pending coordinator requests.</p>
                ) : (
                  pendingCoordinators.map((coord) => (
                    <div className="notif-item" key={coord.id}>
                      <div className="notif-info">
                        <strong>{coord.name}</strong>
                        <span>{coord.college}</span>
                      </div>
                      <button
                        className="notif-action-btn"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/admin/coordinators");
                        }}
                      >
                        Review →
                      </button>
                    </div>
                  ))
                )}
              </div>

              {pendingCoordinators.length > 0 && (
                <div className="admin-dropdown-footer">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/admin/coordinators");
                    }}
                  >
                    View All Coordinators →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>YUWA Operations</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;


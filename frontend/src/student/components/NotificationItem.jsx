import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  Trophy,
  Sparkles,
  Info,
  Check
} from "lucide-react";

const NotificationItem = ({ notification, onMarkRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Submission approved":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "Leaderboard changed":
        return <Trophy size={18} className="text-amber-500" />;
      case "Task deadline":
        return <Clock size={18} className="text-red-500" />;
      case "Evaluator feedback":
        return <Award size={18} className="text-blue-500" />;
      case "New task":
        return <Sparkles size={18} className="text-teal-500" />;
      default:
        return <Bell size={18} className="text-emerald-600" />;
    }
  };

  return (
    <div
      className={`notification-item-card ${!notification.read ? "unread-notif" : "read-notif"}`}
      onClick={() => onMarkRead && onMarkRead(notification.id)}
    >
      <div className="notif-icon-bubble">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="notif-content-area">
        <div className="notif-header-line">
          <div className="notif-title-group">
            {!notification.read && <span className="unread-dot" />}
            <h4 className="notif-item-title">{notification.title}</h4>
          </div>
          <span className="notif-date-stamp">{notification.date}</span>
        </div>

        <p className="notif-message-text">{notification.message}</p>

        <div className="notif-footer-line">
          <span className="notif-type-badge">{notification.type}</span>
          {!notification.read && (
            <button
              type="button"
              className="btn-mark-read"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead && onMarkRead(notification.id);
              }}
            >
              <Check size={13} />
              <span>Mark read</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

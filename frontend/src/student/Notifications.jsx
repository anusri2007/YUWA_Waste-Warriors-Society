import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  BookOpen,
  CheckCheck,
  Sparkles,
  Trash2,
  Check,
  RotateCcw
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./Notifications.css";

const Notifications = ({ notifications: propNotifs, setNotifications: propSetNotifs }) => {
  const context = useStudent();
  const notifs = propNotifs || context.notifications || [];

  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    if (context.handleMarkNotificationRead) {
      context.handleMarkNotificationRead(id);
    } else if (propSetNotifs) {
      propSetNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
      );
    }
  };

  const markAllAsRead = () => {
    if (context.handleMarkAllNotificationsRead) {
      context.handleMarkAllNotificationsRead();
    } else if (propSetNotifs) {
      propSetNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    if (context.handleDeleteNotification) {
      context.handleDeleteNotification(id);
    } else if (propSetNotifs) {
      propSetNotifs((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const filteredNotifications = notifs.filter((item) => {
    if (filter === "unread") return !item.read;
    return true;
  });

  const getCategoryIcon = (type) => {
    switch (type) {
      case "event":
      case "championship":
        return <Sparkles size={18} className="icon-event text-amber-400" />;
      case "assignment":
      case "submission":
        return <CheckCircle2 size={18} className="icon-assignment text-emerald-400" />;
      case "reminder":
        return <Clock size={18} className="icon-reminder text-cyan-400" />;
      default:
        return <Info size={18} className="icon-info text-purple-400" />;
    }
  };

  return (
    <div className="notifications-page-container">
      {/* Header */}
      <section className="notifs-header-card glass-card">
        <div className="notifs-header-text">
          <div className="notifs-tagline-badge">
            <Bell size={14} className="text-amber-400" />
            <span>COMMUNICATIONS & JURY ALERTS</span>
          </div>
          <h2>Announcements & Notifications</h2>
          <p>
            You have <strong className="text-emerald-400">{unreadCount} unread</strong>{" "}
            announcements from YUWA Ecolympics organizers and faculty evaluators.
          </p>
        </div>

        <div className="notifs-header-actions">
          <div className="notifs-filter-pills">
            <button
              type="button"
              className={`notif-pill ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Alerts ({notifs.length})
            </button>
            <button
              type="button"
              className={`notif-pill ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="mark-all-btn eco-btn-secondary"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </section>

      {/* Notifications List */}
      <section className="notifs-list">
        {filteredNotifications.map((item) => {
          const isUnread = !item.read;

          return (
            <div
              key={item.id}
              className={`notif-card glass-card ${isUnread ? "unread" : "read"}`}
              onClick={() => markAsRead(item.id)}
            >
              <div className="notif-card-icon-wrap">
                {getCategoryIcon(item.type)}
              </div>

              <div className="notif-card-content">
                <div className="notif-card-top-row">
                  <div className="notif-title-row">
                    {isUnread && <span className="unread-dot-badge" />}
                    <h4 className="notif-card-title">{item.title}</h4>
                  </div>
                  <span className="notif-card-date">
                    <Clock size={12} /> {item.date}
                  </span>
                </div>

                <p className="notif-card-message">{item.message}</p>

                <div className="notif-card-footer">
                  <span className={`notif-type-tag type-${item.type || "system"}`}>
                    {item.type || "system"}
                  </span>

                  <div className="notif-actions-row">
                    <button
                      type="button"
                      className="toggle-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(item.id);
                      }}
                    >
                      {isUnread ? "Mark as read" : "Mark as unread"}
                    </button>

                    <button
                      type="button"
                      className="btn-delete-notif"
                      onClick={(e) => deleteNotification(e, item.id)}
                      title="Delete alert"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="no-notifs-state glass-card">
            <Bell size={44} className="no-notifs-icon text-emerald-400" />
            <h3>No notifications here</h3>
            <p>You are all caught up! There are no unread announcements right now.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Trophy,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useCoordinator();

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'UNREAD', 'SUBMISSION'

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'SUBMISSION') return n.type === 'submission';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'submission':
        return <FileCheck size={18} className="text-cyan-400" />;
      case 'milestone':
        return <Trophy size={18} className="text-amber-400" />;
      case 'alert':
        return <AlertCircle size={18} className="text-rose-400" />;
      case 'team':
        return <Users size={18} className="text-violet-400" />;
      default:
        return <Bell size={18} className="text-emerald-400" />;
    }
  };

  return (
    <div className="coord-page-container notifications-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Bell className="title-icon" /> Notification Center
          </h1>
          <p className="coord-page-subtitle">
            Stay updated with real-time submission alerts, championship milestones, and squad activities.
          </p>
        </div>
        <div className="coord-page-actions">
          <button
            className="coord-btn coord-btn-secondary"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notif-filters-bar">
        <button
          className={`notif-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveFilter('ALL')}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          className={`notif-filter-btn ${activeFilter === 'UNREAD' ? 'active' : ''}`}
          onClick={() => setActiveFilter('UNREAD')}
        >
          Unread Only ({unreadCount})
        </button>
        <button
          className={`notif-filter-btn ${activeFilter === 'SUBMISSION' ? 'active' : ''}`}
          onClick={() => setActiveFilter('SUBMISSION')}
        >
          Submissions Queue
        </button>
      </div>

      {/* Notifications List */}
      <div className="glass-card notif-list-card">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notif-box">
            <Bell size={40} className="text-slate-500" />
            <h3>No notifications to display</h3>
            <p>You are completely up to date with competition feeds!</p>
          </div>
        ) : (
          <div className="notif-items-list">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item-row ${!notif.read ? 'unread-item' : ''}`}
                onClick={() => {
                  if (!notif.read) markNotificationRead(notif.id);
                  if (notif.link) navigate(notif.link);
                }}
              >
                <div className="notif-icon-circle">{getIcon(notif.type)}</div>

                <div className="notif-content-box">
                  <div className="notif-title-row">
                    <h4>{notif.title}</h4>
                    {!notif.read && <span className="unread-dot-badge">New</span>}
                  </div>
                  <p className="notif-msg">{notif.message}</p>
                  <span className="notif-time">
                    <Clock size={12} /> {notif.timestamp}
                  </span>
                </div>

                <div className="notif-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="notif-delete-btn"
                    title="Delete notification"
                    onClick={() => deleteNotification(notif.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;


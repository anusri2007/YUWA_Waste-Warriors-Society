import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  Bell,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react";
import "./Overview.css";

const Overview = ({
  student,
  courses = [],
  tasks = [],
  notifications = [],
  events = [],
  setActiveTab
}) => {
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const recentNotifications = notifications.slice(0, 3);
  const enrolledCount = courses.length;

  return (
    <div className="overview-container">
      {/* Student Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <span className="welcome-tag">Student ID: {student.studentId}</span>
            <h2>Welcome back, {student.name}! 👋</h2>
            <p className="welcome-subtext">
              {student.department} • {student.year}
            </p>
            <p className="welcome-college">
              🏛️ {student.college}
            </p>
          </div>

          <div className="welcome-actions">
            <button
              className="banner-btn primary-banner-btn"
              onClick={() => setActiveTab("tasks")}
            >
              View Pending Tasks ({pendingTasks.length})
            </button>
            <button
              className="banner-btn secondary-banner-btn"
              onClick={() => setActiveTab("courses")}
            >
              My Courses
            </button>
          </div>
        </div>

        <div className="welcome-badge-card">
          <div className="badge-icon-wrap">
            <Award size={28} />
          </div>
          <div>
            <span className="badge-label">Current CGPA</span>
            <div className="badge-value">{student.cgpa} / 10.0</div>
            <span className="badge-status">Top 10% in Class</span>
          </div>
        </div>
      </section>

      {/* 4 Key Metric Stat Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper attendance-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Attendance Rate</span>
            <div className="stat-val-row">
              <span className="stat-value">{student.attendancePercentage}%</span>
              <span className="stat-pill success-pill">Good Standing</span>
            </div>
            <span className="stat-hint">Required minimum: 75%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper progress-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Overall Progress</span>
            <div className="stat-val-row">
              <span className="stat-value">{student.overallProgress}%</span>
              <span className="stat-pill info-pill">On Track</span>
            </div>
            <div className="stat-mini-progress">
              <div
                className="stat-mini-bar"
                style={{ width: `${student.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper courses-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Courses Enrolled</span>
            <div className="stat-val-row">
              <span className="stat-value">{enrolledCount}</span>
              <span className="stat-pill neutral-pill">Active</span>
            </div>
            <span className="stat-hint">{student.creditsCompleted} Credits Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper tasks-icon">
            <Clock size={24} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Pending Tasks</span>
            <div className="stat-val-row">
              <span className="stat-value">{pendingTasks.length}</span>
              <span className="stat-pill warning-pill">Need Action</span>
            </div>
            <span className="stat-hint">Nearest due: 3 days</span>
          </div>
        </div>
      </section>

      {/* Main Overview Columns */}
      <div className="overview-two-col">
        {/* Left Column: Quick Courses & Upcoming Events */}
        <div className="overview-col-left">
          {/* Quick Courses Preview */}
          <section className="section-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <BookOpen size={18} className="text-emerald" />
                <h3>Course Progress Snapshot</h3>
              </div>
              <button
                className="section-link-btn"
                onClick={() => setActiveTab("courses")}
              >
                All Courses <ArrowRight size={14} />
              </button>
            </div>

            <div className="overview-courses-list">
              {courses.slice(0, 4).map((course) => (
                <div key={course.id} className="quick-course-item">
                  <div className="course-item-info">
                    <div className="course-code-tag">{course.code}</div>
                    <div>
                      <h4 className="course-item-name">{course.name}</h4>
                      <p className="course-item-faculty">{course.faculty}</p>
                    </div>
                  </div>
                  <div className="course-item-progress-wrap">
                    <div className="course-progress-header">
                      <span>{course.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="section-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <Calendar size={18} className="text-emerald" />
                <h3>Upcoming Academic Events</h3>
              </div>
            </div>

            <div className="events-timeline">
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date-badge">
                    <Calendar size={16} />
                  </div>
                  <div className="event-content">
                    <div className="event-header-row">
                      <h4 className="event-title">{event.title}</h4>
                      <span className="event-cat-tag">{event.category}</span>
                    </div>
                    <p className="event-meta">
                      <span>🗓️ {event.date}</span>
                      <span>⏰ {event.time}</span>
                    </p>
                    <p className="event-venue">📍 {event.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Pending Tasks & Recent Notifications */}
        <div className="overview-col-right">
          {/* Urgent / Pending Tasks */}
          <section className="section-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <Clock size={18} className="text-emerald" />
                <h3>Pending Assignments</h3>
              </div>
              <button
                className="section-link-btn"
                onClick={() => setActiveTab("tasks")}
              >
                Manage <ArrowRight size={14} />
              </button>
            </div>

            <div className="overview-tasks-list">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="quick-task-card">
                  <div className="task-header-row">
                    <span className="task-course-chip">{task.courseCode}</span>
                    <span
                      className={`task-priority-tag priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                  <h4 className="quick-task-title">{task.title}</h4>
                  <div className="task-footer-row">
                    <span className="task-due">
                      <Clock size={13} /> Due: {task.dueDate}
                    </span>
                    <button
                      className="task-action-btn"
                      onClick={() => setActiveTab("tasks")}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Notifications */}
          <section className="section-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <Bell size={18} className="text-emerald" />
                <h3>Recent Notifications</h3>
              </div>
              <button
                className="section-link-btn"
                onClick={() => setActiveTab("notifications")}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="overview-notifs-list">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`overview-notif-item ${!notif.read ? "unread" : ""}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <div className="notif-indicator">
                    {!notif.read ? (
                      <span className="unread-dot" />
                    ) : (
                      <AlertCircle size={14} className="read-icon" />
                    )}
                  </div>
                  <div className="notif-body">
                    <h5 className="notif-title">{notif.title}</h5>
                    <p className="notif-msg">{notif.message}</p>
                    <span className="notif-time">{notif.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;

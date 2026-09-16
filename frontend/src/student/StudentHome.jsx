import React from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Leaf,
  Calendar,
  Recycle,
  Upload,
  Clock
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./StudentHome.css";

const StudentHome = () => {
  const { student, competition, team, tasks, submissions } = useStudent();

  const statCards = [
    {
      id: "points",
      title: "My Points",
      value: student.points.toLocaleString(),
      subtext: `+${student.weeklyPoints} pts this week`,
      icon: Award,
      color: "glow-amber",
      progress: Math.min(100, Math.round((student.points / 2000) * 100)),
      progressLabel: "Target: 2,000 pts"
    },
    {
      id: "tasks",
      title: "Tasks Completed",
      value: `${student.tasksCompleted} / ${student.totalTasks}`,
      subtext: `${student.totalTasks - student.tasksCompleted} challenges remaining`,
      icon: CheckCircle2,
      color: "glow-emerald",
      progress: Math.round((student.tasksCompleted / student.totalTasks) * 100),
      progressLabel: `${Math.round((student.tasksCompleted / student.totalTasks) * 100)}% finished`
    },
    {
      id: "rank",
      title: "Current Rank",
      value: `#${student.rank}`,
      subtext: `Up from #${student.previousRank} this week`,
      icon: Trophy,
      color: "glow-cyan",
      progress: 88,
      progressLabel: "Top 15% tier"
    },
    {
      id: "team-progress",
      title: "Team Progress",
      value: `${team.progress}%`,
      subtext: `${team.name} • Rank #${team.rank}`,
      icon: Users,
      color: "glow-violet",
      progress: team.progress,
      progressLabel: `${team.completedTasks} team actions done`
    }
  ];

  const upcomingTasks = tasks.filter((t) => t.status === "Available").slice(0, 3);
  const recentSubs = submissions.slice(0, 2);

  return (
    <div className="student-home-container">
      {/* Top Greeting Hero Banner */}
      <section className="home-hero-greeting glass-card">
        <div className="greeting-text-area">
          <div className="greeting-badge">
            <Leaf size={14} className="text-emerald-400" />
            <span>YUWA Ecolympics Participant Hub</span>
          </div>

          <h2 className="greeting-title">
            Good Morning, {student.name.split(" ")[0]}! 👋
          </h2>

          <p className="greeting-subtitle">
            Ready to make an impact for a greener future? You have diverted{" "}
            <strong className="text-emerald-300">75.4 kg</strong> of waste and earned{" "}
            <strong className="text-amber-300">{student.points} points</strong> so far!
          </p>

          <div className="greeting-cta-row">
            <Link to="/student/tasks/available" className="eco-btn-primary">
              <span>View Available Tasks</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/student/submit" className="eco-btn-secondary">
              <Upload size={16} />
              <span>Submit Activity</span>
            </Link>
          </div>
        </div>

        <div className="greeting-badge-sphere">
          <div className="sphere-inner">
            <Sparkles size={24} className="text-emerald-400" />
            <span className="sphere-pts">{student.points}</span>
            <span className="sphere-lbl">Total Score</span>
          </div>
        </div>
      </section>

      {/* 4 Glassmorphism Stat Cards */}
      <section className="home-stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className={`glass-stat-card ${card.color}`}>
              <div className="stat-card-top-row">
                <span className="stat-card-title">{card.title}</span>
                <div className="stat-icon-wrapper">
                  <Icon size={20} />
                </div>
              </div>

              <div className="stat-card-number">{card.value}</div>
              <p className="stat-card-subtext">{card.subtext}</p>

              <div className="stat-progress-bar-wrap">
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
                <span className="stat-bar-label">{card.progressLabel}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Hero Active Competition Glass Card */}
      <section className="home-competition-hero glass-card">
        <div className="comp-hero-inner">
          <div className="comp-hero-info">
            <div className="comp-status-row">
              <span className="comp-live-badge">
                <span className="live-pulse" /> {competition.status}
              </span>
              <span className="comp-tag-line">{competition.subtitle}</span>
            </div>

            <h3 className="comp-hero-title">{competition.title}</h3>
            <p className="comp-hero-desc">
              Unite with 380+ youth climate warriors across the country in high-impact cleanups,
              circular composting, and waste diversion operations.
            </p>

            {/* Competition Key Metrics */}
            <div className="comp-metrics-capsules">
              <div className="comp-capsule">
                <Clock size={14} className="text-cyan-400" />
                <span>{competition.daysRemaining} Days Remaining</span>
              </div>
              <div className="comp-capsule">
                <Award size={14} className="text-amber-400" />
                <span>{competition.currentPoints} Points</span>
              </div>
              <div className="comp-capsule">
                <Trophy size={14} className="text-emerald-400" />
                <span>Rank #{competition.currentRank}</span>
              </div>
              <div className="comp-capsule">
                <Users size={14} className="text-purple-400" />
                <span>{competition.teamName}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="comp-hero-progress-area">
              <div className="comp-prog-header">
                <span>Championship Completion</span>
                <strong>{competition.progressPercentage}%</strong>
              </div>
              <div className="comp-prog-track">
                <div
                  className="comp-prog-fill"
                  style={{ width: `${competition.progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="comp-hero-actions">
              <Link to="/student/competition" className="eco-btn-primary">
                <span>Continue Competition</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/student/team" className="eco-btn-secondary">
                <span>View Team Roster</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Columns: Available Tasks Preview + Recent Activity */}
      <div className="home-split-grid">
        {/* Left Column: Tasks Preview */}
        <div className="home-left-col">
          <div className="home-section-header">
            <div className="section-title-tag">
              <Sparkles size={16} className="text-emerald-400" />
              <h3>Recommended Tasks For You</h3>
            </div>
            <Link to="/student/tasks/available" className="view-all-link">
              <span>View Available ({tasks.filter(t => t.status === "Available").length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="home-tasks-stack">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="home-task-card glass-card">
                <div className="task-card-top">
                  <span className="task-cat-badge">{t.category}</span>
                  <span className="task-pts-badge">+{t.points} pts</span>
                </div>
                <h4 className="home-task-title">{t.title}</h4>
                <p className="home-task-desc">{t.description}</p>
                <div className="home-task-bottom">
                  <span className="task-due-date">
                    <Calendar size={13} /> Due: {t.deadline}
                  </span>
                  <Link
                    to={`/student/submit`}
                    state={{ taskId: t.id }}
                    className="task-quick-submit-btn"
                  >
                    Start Task
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Team Snapshot & Recent Submissions */}
        <div className="home-right-col">
          {/* Team Snapshot Card */}
          <div className="home-team-card glass-card">
            <div className="team-header-row">
              <div>
                <span className="team-sub">YOUR SQUAD</span>
                <h4 className="team-title">{team.name}</h4>
              </div>
              <span className="team-rank-pill">Rank #{team.rank}</span>
            </div>

            <div className="team-members-compact">
              {team.members.map((m) => (
                <div key={m.id} className="compact-member-row">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="member-tiny-avatar"
                  />
                  <div className="member-tiny-info">
                    <span className="member-tiny-name">
                      {m.name} {m.isCurrentUser && "(You)"}
                    </span>
                    <span className="member-tiny-role">{m.role}</span>
                  </div>
                  <span className="member-tiny-pts">{m.points} pts</span>
                </div>
              ))}
            </div>

            <Link to="/student/team" className="team-view-btn">
              <span>View Full Team Roster</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Recent Submissions Card */}
          <div className="home-subs-card glass-card">
            <div className="subs-header-row">
              <h4>Recent Submissions</h4>
              <Link to="/student/submissions" className="view-all-link">
                History
              </Link>
            </div>

            <div className="compact-subs-list">
              {recentSubs.map((sub) => (
                <div key={sub.id} className="compact-sub-item">
                  <div className="sub-item-top">
                    <span className="sub-name">{sub.activityName}</span>
                    <span className={`sub-status-pill status-${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </div>
                  <div className="sub-item-bottom">
                    <span>{sub.submissionDate}</span>
                    <strong>+{sub.points} pts</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;

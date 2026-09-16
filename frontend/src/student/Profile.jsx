import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Award,
  BookOpen,
  Edit3,
  Check,
  X,
  ShieldCheck,
  GraduationCap,
  Trophy,
  Recycle,
  Sparkles,
  Users,
  Shield,
  Star
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./Profile.css";

const Profile = ({ student: propStudent, setStudent: propSetStudent }) => {
  const context = useStudent();
  const currentStudent = propStudent || context.student;
  const achievements = context.achievements || [];
  const team = context.team || {};

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentStudent });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (context.handleUpdateProfile) {
      context.handleUpdateProfile(formData);
    } else if (propSetStudent) {
      propSetStudent({ ...formData });
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...currentStudent });
    setIsEditing(false);
  };

  const getAchievementIcon = (iconName) => {
    switch (iconName) {
      case "Shield":
        return <Shield size={24} />;
      case "Award":
        return <Award size={24} />;
      case "Users":
        return <Users size={24} />;
      default:
        return <Trophy size={24} />;
    }
  };

  return (
    <div className="profile-page-container">
      {saveSuccess && (
        <div className="profile-alert success glass-card">
          <Check size={18} className="text-emerald-400" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <section className="profile-hero-card glass-card">
        <div className="profile-avatar-large-wrap">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="profile-avatar-large"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="profile-avatar-initials">
            {currentStudent.name ? currentStudent.name.charAt(0) : "S"}
          </div>
          <span className="profile-status-badge">
            <span className="status-ping" /> {currentStudent.status || "Active Warrior"}
          </span>
        </div>

        <div className="profile-hero-details">
          <div className="profile-hero-main">
            <div className="profile-role-tag">
              <Sparkles size={13} className="text-emerald-400" />
              <span>YUWA Eco-Warrior • {currentStudent.team}</span>
            </div>
            <h2>{currentStudent.name}</h2>
            <p className="profile-tagline">
              {currentStudent.course || currentStudent.department} • {currentStudent.year}
            </p>
            <p className="profile-college-name">
              <Building2 size={16} /> {currentStudent.college}
            </p>
          </div>

          <div className="profile-hero-stats">
            <div className="hero-stat-box">
              <span className="hero-stat-title">Total Points</span>
              <span className="hero-stat-value text-amber-400">
                {currentStudent.points ? currentStudent.points.toLocaleString() : "1,240"} pts
              </span>
            </div>
            <div className="hero-stat-box">
              <span className="hero-stat-title">Current Rank</span>
              <span className="hero-stat-value text-emerald-400">
                Rank #{currentStudent.rank || 12}
              </span>
            </div>
            <div className="hero-stat-box">
              <span className="hero-stat-title">Tasks Completed</span>
              <span className="hero-stat-value text-cyan-400">
                {currentStudent.tasksCompleted || 18} / {currentStudent.totalTasks || 25}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="edit-profile-action-btn eco-btn-secondary"
          onClick={() => {
            setFormData({ ...currentStudent });
            setIsEditing(true);
          }}
        >
          <Edit3 size={16} />
          <span>Edit Profile</span>
        </button>
      </section>

      {/* Badges & Achievements Showcase */}
      <section className="profile-achievements-section glass-card">
        <div className="achievements-header">
          <div className="ach-title-group">
            <Trophy size={20} className="text-amber-400" />
            <h3>Championship Badges & Honors ({achievements.length})</h3>
          </div>
          <span className="text-xs text-muted">Earned in National Ecolympics 2026</span>
        </div>

        <div className="achievements-grid">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="achievement-card"
              style={{ borderColor: ach.color ? `${ach.color}40` : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="ach-icon-circle"
                style={{
                  backgroundColor: ach.color ? `${ach.color}20` : "rgba(16,185,129,0.2)",
                  color: ach.color || "#10b981",
                  borderColor: ach.color ? `${ach.color}60` : "#10b981"
                }}
              >
                {getAchievementIcon(ach.icon)}
              </div>

              <div className="ach-info">
                <div className="ach-top-line">
                  <h4 className="ach-title">{ach.title}</h4>
                  <span
                    className="ach-level-badge"
                    style={{
                      backgroundColor: ach.color ? `${ach.color}25` : "rgba(255,255,255,0.1)",
                      color: ach.color || "#ffffff"
                    }}
                  >
                    {ach.level}
                  </span>
                </div>
                <p className="ach-desc">{ach.description}</p>
                <span className="ach-date">
                  <Calendar size={11} /> Earned: {ach.earnedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details Grid */}
      <div className="profile-content-grid">
        {/* Left: Detailed Information & Edit Form */}
        <section className="profile-section-card glass-card">
          <div className="profile-section-header">
            <div className="section-title-wrapper">
              <User size={18} className="text-emerald-400" />
              <h3>Personal & Institutional Information</h3>
            </div>
            {!isEditing && (
              <button
                type="button"
                className="inline-edit-btn"
                onClick={() => {
                  setFormData({ ...currentStudent });
                  setIsEditing(true);
                }}
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-info-grid">
              <div className="info-field">
                <span className="field-label">Full Name</span>
                <div className="field-val-wrap">
                  <User size={15} className="field-icon" />
                  <span className="field-value">{currentStudent.name}</span>
                </div>
              </div>

              <div className="info-field">
                <span className="field-label">Student / Warrior ID</span>
                <div className="field-val-wrap">
                  <ShieldCheck size={15} className="field-icon" />
                  <span className="field-value highlight-val">
                    {currentStudent.id || currentStudent.studentId || "STU-8842"}
                  </span>
                </div>
              </div>

              <div className="info-field">
                <span className="field-label">Email Address</span>
                <div className="field-val-wrap">
                  <Mail size={15} className="field-icon" />
                  <span className="field-value">{currentStudent.email}</span>
                </div>
              </div>

              <div className="info-field">
                <span className="field-label">Contact Phone</span>
                <div className="field-val-wrap">
                  <Phone size={15} className="field-icon" />
                  <span className="field-value">{currentStudent.phone}</span>
                </div>
              </div>

              <div className="info-field">
                <span className="field-label">Assigned Squad</span>
                <div className="field-val-wrap">
                  <Users size={15} className="field-icon" />
                  <span className="field-value text-emerald-300">
                    {currentStudent.team || "Green Warriors"}
                  </span>
                </div>
              </div>

              <div className="info-field">
                <span className="field-label">Academic Year / Batch</span>
                <div className="field-val-wrap">
                  <Calendar size={15} className="field-icon" />
                  <span className="field-value">{currentStudent.year}</span>
                </div>
              </div>

              <div className="info-field full-width">
                <span className="field-label">Institution / College</span>
                <div className="field-val-wrap">
                  <Building2 size={15} className="field-icon" />
                  <span className="field-value">{currentStudent.college}</span>
                </div>
              </div>

              <div className="info-field full-width">
                <span className="field-label">Bio & Environmental Focus</span>
                <p className="profile-bio-text">{currentStudent.bio}</p>
              </div>
            </div>
          ) : (
            /* Interactive Editing Form */
            <form onSubmit={handleSave} className="profile-edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year & Batch</label>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    required
                    value={formData.year || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="college">College / University</label>
                  <input
                    id="college"
                    name="college"
                    type="text"
                    required
                    value={formData.college || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bio">Bio & Environmental Mission</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn eco-btn-secondary"
                  onClick={handleCancel}
                >
                  <X size={16} /> Cancel
                </button>
                <button type="submit" className="save-btn eco-btn-primary">
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Right: Squad Standing & Impact Summary */}
        <div className="profile-side-col">
          <section className="profile-section-card glass-card">
            <div className="profile-section-header">
              <div className="section-title-wrapper">
                <Recycle size={18} className="text-emerald-400" />
                <h3>Environmental Impact Pace</h3>
              </div>
            </div>

            <div className="standing-metrics-list">
              <div className="standing-metric-item">
                <div className="metric-header">
                  <span>Task Completion Quota</span>
                  <strong>{Math.round(((currentStudent.tasksCompleted || 18) / (currentStudent.totalTasks || 25)) * 100)}%</strong>
                </div>
                <div className="metric-bar-bg">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${((currentStudent.tasksCompleted || 18) / (currentStudent.totalTasks || 25)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="standing-metric-item">
                <div className="metric-header">
                  <span>Squad Contribution</span>
                  <strong>
                    {Math.round(((currentStudent.points || 1240) / (team.points || 3840)) * 100)}%
                  </strong>
                </div>
                <div className="metric-bar-bg">
                  <div
                    className="metric-bar-fill fill-cyan"
                    style={{
                      width: `${((currentStudent.points || 1240) / (team.points || 3840)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="advisor-box">
              <div className="advisor-avatar">AM</div>
              <div className="advisor-info">
                <span className="advisor-label">Squad Team Leader</span>
                <strong className="advisor-name">{team.leader || "Aarav Mehta"}</strong>
                <span className="advisor-email">{team.code || "TEAM-GW04"}</span>
              </div>
            </div>
          </section>

          <section className="profile-section-card glass-card">
            <div className="profile-section-header">
              <div className="section-title-wrapper">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h3>Championship Credentials</h3>
              </div>
            </div>

            <ul className="details-list">
              <li>
                <span>Championship:</span>
                <strong>YUWA Ecolympics 2026</strong>
              </li>
              <li>
                <span>Division:</span>
                <strong>National League Tier 1</strong>
              </li>
              <li>
                <span>Squad Status:</span>
                <strong className="text-emerald-400">Verified & Active</strong>
              </li>
              <li>
                <span>Jury Verification:</span>
                <strong className="text-cyan-400">Level 3 Cleared</strong>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;

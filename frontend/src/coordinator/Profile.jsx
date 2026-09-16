import React, { useState } from 'react';
import {
  UserCheck,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Key,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  MapPin,
  Calendar
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import './Profile.css';

const Profile = () => {
  const { coordinatorProfile, updateCoordinatorProfile, stats } = useCoordinator();

  const [formData, setFormData] = useState({
    name: coordinatorProfile.name,
    designation: coordinatorProfile.designation,
    department: coordinatorProfile.department || 'Environmental Sciences & Sustainability',
    college: coordinatorProfile.college,
    email: coordinatorProfile.email,
    phone: coordinatorProfile.phone,
    bio:
      coordinatorProfile.bio ||
      'Lead Faculty Coordinator overseeing campus waste audits, circular economy projects, and student sustainability missions across collegiate chapters.'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateCoordinatorProfile(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Security credentials updated successfully.');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="coord-page-container profile-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <UserCheck className="title-icon" /> Coordinator Profile & Credentials
          </h1>
          <p className="coord-page-subtitle">
            Manage your administrative profile, institutional affiliations, security settings, and audit authorizations.
          </p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Left: Profile Card & Quick Stats */}
        <div className="profile-left-col">
          {/* Identity Dossier Card */}
          <div className="glass-card profile-identity-card">
            <div className="profile-avatar-box">
              <img
                src={coordinatorProfile.avatar}
                alt={coordinatorProfile.name}
                className="profile-main-avatar"
              />
              <span className="profile-verified-badge" title="Verified Coordinator">
                <ShieldCheck size={16} />
              </span>
            </div>

            <h2 className="profile-name">{coordinatorProfile.name}</h2>
            <span className="profile-badge-pill">{coordinatorProfile.badge}</span>
            <p className="profile-desig">{coordinatorProfile.designation}</p>

            <div className="profile-meta-list">
              <div className="meta-row">
                <Building2 size={16} className="text-cyan-400" />
                <span>{coordinatorProfile.college}</span>
              </div>
              <div className="meta-row">
                <Mail size={16} className="text-emerald-400" />
                <span>{coordinatorProfile.email}</span>
              </div>
              <div className="meta-row">
                <Phone size={16} className="text-violet-400" />
                <span>{coordinatorProfile.phone}</span>
              </div>
            </div>
          </div>

          {/* Coordinator Impact Stats */}
          <div className="glass-card coordinator-stats-card">
            <h3 className="section-title">
              <Sparkles size={18} className="text-emerald-400" /> Administrative Metrics
            </h3>

            <div className="coord-stat-item">
              <span className="coord-stat-lbl">Submissions Verified</span>
              <span className="coord-stat-val font-bold text-emerald-400">
                {stats.approvedSubmissions + 85}
              </span>
            </div>
            <div className="coord-stat-item">
              <span className="coord-stat-lbl">Points Awarded</span>
              <span className="coord-stat-val font-bold text-cyan-400">
                {stats.totalPointsAwarded.toLocaleString()}
              </span>
            </div>
            <div className="coord-stat-item">
              <span className="coord-stat-lbl">Tasks Published</span>
              <span className="coord-stat-val font-bold text-violet-400">
                {stats.activeTasks + 4}
              </span>
            </div>
            <div className="coord-stat-item">
              <span className="coord-stat-lbl">Security Clearance</span>
              <span className="coord-stat-val text-amber-400 font-bold">Level 3 (Full Lead)</span>
            </div>
          </div>
        </div>

        {/* Right: Edit Profile & Security Forms */}
        <div className="profile-right-col">
          {/* Edit Profile Form */}
          <form className="glass-card profile-form-card" onSubmit={handleProfileSubmit}>
            <h3 className="section-title">
              <UserCheck size={18} className="text-emerald-400" /> General Information
            </h3>

            <div className="form-row-2">
              <div className="form-group">
                <label className="coord-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="coord-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="coord-label">Designation / Role</label>
                <input
                  type="text"
                  name="designation"
                  className="coord-input"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="coord-label">Institutional College</label>
                <input
                  type="text"
                  name="college"
                  className="coord-input"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="coord-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="coord-input"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="coord-label">Official Email</label>
                <input
                  type="email"
                  name="email"
                  className="coord-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="coord-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="coord-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="coord-label">Bio / Academic Profile</label>
              <textarea
                name="bio"
                rows="3"
                className="coord-textarea"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="form-btn-wrap">
              <button type="submit" className="coord-btn coord-btn-primary">
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          </form>

          {/* Security & Password */}
          <form className="glass-card profile-form-card" onSubmit={handlePasswordSubmit}>
            <h3 className="section-title">
              <Key size={18} className="text-cyan-400" /> Security & Access Credentials
            </h3>

            <div className="form-row-3">
              <div className="form-group">
                <label className="coord-label">Current Password</label>
                <input
                  type="password"
                  className="coord-input"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, currentPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="coord-label">New Password</label>
                <input
                  type="password"
                  className="coord-input"
                  placeholder="••••••••"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="coord-label">Confirm New Password</label>
                <input
                  type="password"
                  className="coord-input"
                  placeholder="••••••••"
                  value={securityData.confirmPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-btn-wrap">
              <button type="submit" className="coord-btn coord-btn-secondary">
                <ShieldCheck size={16} /> Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;


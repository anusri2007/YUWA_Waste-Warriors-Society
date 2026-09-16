import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Building2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  FileText,
  ExternalLink,
  Flame,
  Leaf,
  Sparkles,
  Trophy
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import StatusBadge from './components/StatusBadge';
import SubmissionCard from './components/SubmissionCard';
import './StudentDetails.css';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, submissions, tasks, teams, approveSubmission, rejectSubmission } = useCoordinator();

  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions', 'tasks', 'achievements'

  // Find student
  const student = students.find((s) => String(s.id) === String(id));

  if (!student) {
    return (
      <div className="coord-page-container">
        <div className="glass-card not-found-box">
          <h2>Student Not Found</h2>
          <p>The student with ID "{id}" does not exist in the competition database.</p>
          <button className="coord-btn coord-btn-primary" onClick={() => navigate('/coordinator/students')}>
            <ArrowLeft size={16} /> Back to Students
          </button>
        </div>
      </div>
    );
  }

  // Filter student submissions
  const studentSubmissions = submissions.filter(
    (sub) => sub.studentName === student.name || sub.id === `sub-${student.id}`
  );

  // Student team
  const studentTeam = teams.find((t) => t.name === student.teamName);

  // Mock student badges / achievements
  const achievements = [
    {
      id: 1,
      title: 'Zero Waste Pioneer',
      desc: 'Completed first 5 plastic segregation tasks without error.',
      icon: Leaf,
      color: 'emerald',
      dateEarned: '2026-03-05'
    },
    {
      id: 2,
      title: 'Campus Clean Leader',
      desc: 'Top contributor in college campus cleanup drive.',
      icon: Trophy,
      color: 'amber',
      dateEarned: '2026-03-10'
    },
    {
      id: 3,
      title: '7-Day Eco Streak',
      desc: 'Submitted daily sustainability tasks for a full week.',
      icon: Flame,
      color: 'violet',
      dateEarned: '2026-03-12'
    },
    {
      id: 4,
      title: 'Verified Eco Hero',
      desc: 'Achieved 100% submission approval rate from coordinator.',
      icon: Sparkles,
      color: 'cyan',
      dateEarned: '2026-03-14'
    }
  ];

  return (
    <div className="coord-page-container student-details-page">
      {/* Back Button */}
      <div className="back-nav-bar">
        <button className="back-btn" onClick={() => navigate('/coordinator/students')}>
          <ArrowLeft size={16} /> Back to Student Directory
        </button>
      </div>

      {/* Hero Profile Dossier Card */}
      <div className="glass-card student-hero-card">
        <div className="student-hero-content">
          <div className="student-avatar-wrapper">
            <img
              src={student.avatar}
              alt={student.name}
              className="student-hero-avatar"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div className={`student-rank-badge rank-${student.rank <= 3 ? student.rank : 'default'}`}>
              #{student.rank}
            </div>
          </div>

          <div className="student-main-info">
            <div className="student-name-row">
              <h2>{student.name}</h2>
              <StatusBadge status={student.status} />
            </div>
            <p className="student-roll-id">Roll No: {student.rollNo} • ID: #{student.id}</p>

            <div className="student-contact-grid">
              <div className="contact-item">
                <Building2 size={15} />
                <span>{student.college}</span>
              </div>
              <div className="contact-item">
                <Users size={15} />
                <span>
                  Team: <strong>{student.teamName}</strong>
                </span>
              </div>
              <div className="contact-item">
                <Mail size={15} />
                <span>{student.email}</span>
              </div>
              <div className="contact-item">
                <Calendar size={15} />
                <span>Joined {student.joinedDate || 'March 2026'}</span>
              </div>
            </div>
          </div>

          <div className="student-points-badge-box">
            <span className="points-title">Total Points</span>
            <span className="points-value">{student.points.toLocaleString()}</span>
            <span className="points-sub">Ecolympics Score</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="student-metrics-grid">
        <div className="metric-box glass-card">
          <div className="metric-icon emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{student.tasksCompleted}</span>
            <span className="metric-label">Tasks Completed</span>
          </div>
        </div>

        <div className="metric-box glass-card">
          <div className="metric-icon cyan">
            <FileText size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{studentSubmissions.length || student.tasksCompleted}</span>
            <span className="metric-label">Total Submissions</span>
          </div>
        </div>

        <div className="metric-box glass-card">
          <div className="metric-icon amber">
            <Award size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">Rank #{student.rank}</span>
            <span className="metric-label">Global Standing</span>
          </div>
        </div>

        <div className="metric-box glass-card">
          <div className="metric-icon violet">
            <Leaf size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-number">{(student.points * 0.08).toFixed(1)} kg</span>
            <span className="metric-label">Est. Waste Diverted</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="student-tabs-header">
        <button
          className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <FileText size={16} /> Submissions ({studentSubmissions.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle2 size={16} /> Assigned Tasks ({tasks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Award size={16} /> Badges & Impact ({achievements.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="student-tab-content">
        {activeTab === 'submissions' && (
          <div className="submissions-tab-view">
            {studentSubmissions.length === 0 ? (
              <div className="glass-card empty-sub-box">
                <FileText size={40} className="text-slate-500" />
                <h4>No submissions recorded yet</h4>
                <p>When {student.name} submits evidence for tasks, they will appear here for review.</p>
              </div>
            ) : (
              <div className="submissions-card-list">
                {studentSubmissions.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    submission={sub}
                    onApprove={(id, pts) => approveSubmission(id, pts)}
                    onReject={(id, reason) => rejectSubmission(id, reason)}
                    onViewDetails={(id) => navigate(`/coordinator/submissions/${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab-view">
            <div className="glass-card table-responsive">
              <table className="coord-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Category</th>
                    <th>Max Points</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, idx) => (
                    <tr key={task.id}>
                      <td className="font-semibold text-white">{task.title}</td>
                      <td>
                        <span className="cat-badge">{task.category}</span>
                      </td>
                      <td className="text-emerald-400 font-bold">+{task.points} pts</td>
                      <td>{task.deadline}</td>
                      <td>
                        <StatusBadge
                          status={idx < student.tasksCompleted ? 'Completed' : 'Upcoming'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab-view">
            <div className="achievements-grid">
              {achievements.map((ach) => {
                const Icon = ach.icon;
                return (
                  <div key={ach.id} className="achievement-card glass-card">
                    <div className={`ach-icon-circle ${ach.color}`}>
                      <Icon size={26} />
                    </div>
                    <div className="ach-details">
                      <h4>{ach.title}</h4>
                      <p>{ach.desc}</p>
                      <span className="ach-date">Unlocked {ach.dateEarned}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Team Info Banner */}
      {studentTeam && (
        <div className="glass-card student-team-banner">
          <div className="team-banner-left">
            <div className="team-avatar-box">
              <Users size={24} />
            </div>
            <div>
              <span className="team-banner-tag">Team Affiliation</span>
              <h3>{studentTeam.name}</h3>
              <p>Leader: {studentTeam.leader} • {studentTeam.membersCount} active members</p>
            </div>
          </div>
          <div className="team-banner-right">
            <button
              className="coord-btn coord-btn-secondary"
              onClick={() => navigate(`/coordinator/teams/${studentTeam.id}`)}
            >
              View Full Team Profile <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;


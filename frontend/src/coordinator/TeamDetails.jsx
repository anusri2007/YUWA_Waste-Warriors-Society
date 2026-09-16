import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Award,
  CheckCircle2,
  Building2,
  UserCheck,
  TrendingUp,
  FileText,
  ExternalLink,
  Target,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import StudentCard from './components/StudentCard';
import StatusBadge from './components/StatusBadge';
import './TeamDetails.css';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams, students, submissions, tasks } = useCoordinator();

  const [activeTab, setActiveTab] = useState('members'); // 'members', 'submissions', 'tasks'

  // Find team
  const team = teams.find((t) => String(t.id) === String(id));

  if (!team) {
    return (
      <div className="coord-page-container">
        <div className="glass-card not-found-box">
          <h2>Team Not Found</h2>
          <p>The team with ID "{id}" does not exist in the competition database.</p>
          <button className="coord-btn coord-btn-primary" onClick={() => navigate('/coordinator/teams')}>
            <ArrowLeft size={16} /> Back to Teams
          </button>
        </div>
      </div>
    );
  }

  // Get members of this team
  const teamMembers = students.filter(
    (s) => s.teamName === team.name || s.college === team.college
  );

  // Get team submissions
  const teamSubmissions = submissions.filter((sub) =>
    teamMembers.some((m) => m.name === sub.studentName)
  );

  const targetPoints = 12000;
  const progressPercent = Math.min(Math.round((team.points / targetPoints) * 100), 100);

  return (
    <div className="coord-page-container team-details-page">
      {/* Back Button */}
      <div className="back-nav-bar">
        <button className="back-btn" onClick={() => navigate('/coordinator/teams')}>
          <ArrowLeft size={16} /> Back to Teams Directory
        </button>
      </div>

      {/* Hero Dossier Card */}
      <div className="glass-card team-hero-card">
        <div className="team-hero-content">
          <div className="team-badge-wrapper">
            <div className="team-main-icon">
              <Users size={36} />
            </div>
            <div className={`team-rank-pill rank-${team.rank <= 3 ? team.rank : 'default'}`}>
              Rank #{team.rank}
            </div>
          </div>

          <div className="team-main-info">
            <div className="team-title-row">
              <h2>{team.name}</h2>
              <span className="team-code-tag">{team.code}</span>
            </div>
            <p className="team-college-sub">
              <Building2 size={16} /> {team.college}
            </p>

            <div className="team-meta-row">
              <div className="meta-pill">
                <UserCheck size={15} />
                <span>Leader: <strong>{team.leader}</strong></span>
              </div>
              <div className="meta-pill">
                <Users size={15} />
                <span>Squad: <strong>{team.membersCount || teamMembers.length} Members</strong></span>
              </div>
              <div className="meta-pill">
                <CheckCircle2 size={15} />
                <span>Tasks: <strong>{team.tasksCompleted} Completed</strong></span>
              </div>
            </div>
          </div>

          <div className="team-points-box">
            <span className="team-pts-lbl">Aggregate Points</span>
            <span className="team-pts-val">{team.points.toLocaleString()}</span>
            <div className="team-progress-wrap">
              <div className="team-progress-info">
                <span>Milestone</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="team-progress-bar">
                <div className="team-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="student-tabs-header">
        <button
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <Users size={16} /> Squad Members ({teamMembers.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <FileText size={16} /> Team Submissions ({teamSubmissions.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle2 size={16} /> Team Roadmap ({tasks.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="team-tab-content">
        {activeTab === 'members' && (
          <div className="team-members-grid">
            {teamMembers.map((member) => (
              <StudentCard
                key={member.id}
                student={member}
                onViewDetails={(id) => navigate(`/coordinator/students/${id}`)}
              />
            ))}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="submissions-tab-view">
            {teamSubmissions.length === 0 ? (
              <div className="glass-card empty-sub-box">
                <FileText size={40} className="text-slate-500" />
                <h4>No team submissions yet</h4>
                <p>Team members' submitted tasks will appear here for review.</p>
              </div>
            ) : (
              <div className="glass-card table-responsive">
                <table className="coord-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Submitted By</th>
                      <th>Date</th>
                      <th>Points</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="font-semibold text-white">{sub.taskTitle}</td>
                        <td>{sub.studentName}</td>
                        <td>{sub.submittedAt}</td>
                        <td className="text-emerald-400 font-bold">+{sub.points} pts</td>
                        <td>
                          <StatusBadge status={sub.status} />
                        </td>
                        <td>
                          <button
                            className="coord-btn coord-btn-secondary coord-btn-sm"
                            onClick={() => navigate(`/coordinator/submissions/${sub.id}`)}
                          >
                            Review <ExternalLink size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    <th>Points</th>
                    <th>Deadline</th>
                    <th>Completion Status</th>
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
                          status={idx < team.tasksCompleted ? 'Completed' : 'Upcoming'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;


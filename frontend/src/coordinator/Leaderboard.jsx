import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Award,
  Users,
  Users2,
  Building2,
  Search,
  Download,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import './Leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { students, teams, colleges } = useCoordinator();

  const [activeTab, setActiveTab] = useState('students'); // 'students', 'teams', 'colleges'
  const [searchQuery, setSearchQuery] = useState('');

  // Top 3 Podium Data
  const currentList = useMemo(() => {
    const list = activeTab === 'students'
      ? [...students].sort((a, b) => a.rank - b.rank)
      : activeTab === 'teams'
        ? [...teams].sort((a, b) => a.rank - b.rank)
        : [...colleges].sort((a, b) => a.rank - b.rank);

    return list.filter((item) => {
      const name = item.name || '';
      const sub = item.college || item.leader || item.city || '';
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [activeTab, students, teams, colleges, searchQuery]);

  const topThree = currentList.slice(0, 3);

  // Export Leaderboard
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Rank,Name,Affiliation,Points']
        .concat(
          currentList.map(
            (item) =>
              `${item.rank},"${item.name}","${item.college || item.leader || item.city || ''}",${item.points}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yuwa_leaderboard_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="coord-page-container leaderboard-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Trophy className="title-icon" /> Official Championship Leaderboard
          </h1>
          <p className="coord-page-subtitle">
            Real-time standings for individual eco-warriors, squad collectives, and participating institutions.
          </p>
        </div>
        <div className="coord-page-actions">
          <button className="coord-btn coord-btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export Leaderboard
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="leaderboard-tabs-bar">
        <button
          className={`leader-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={16} /> Individual Students
        </button>
        <button
          className={`leader-tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          <Users2 size={16} /> Squad Teams
        </button>
        <button
          className={`leader-tab ${activeTab === 'colleges' ? 'active' : ''}`}
          onClick={() => setActiveTab('colleges')}
        >
          <Building2 size={16} /> College Institutions
        </button>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="podium-container">
          {/* Rank 2 (Silver) */}
          <div className="podium-card silver glass-card">
            <div className="podium-rank-badge rank-2">2</div>
            <div className="podium-avatar-box">
              {topThree[1].avatar ? (
                <img src={topThree[1].avatar} alt={topThree[1].name} />
              ) : (
                <div className="podium-icon silver"><Users size={28} /></div>
              )}
            </div>
            <h3 className="podium-name">{topThree[1].name}</h3>
            <span className="podium-sub">{topThree[1].college || topThree[1].leader || topThree[1].city}</span>
            <div className="podium-score silver">
              {topThree[1].points.toLocaleString()} pts
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="podium-card gold glass-card">
            <div className="crown-icon">👑</div>
            <div className="podium-rank-badge rank-1">1</div>
            <div className="podium-avatar-box gold">
              {topThree[0].avatar ? (
                <img src={topThree[0].avatar} alt={topThree[0].name} />
              ) : (
                <div className="podium-icon gold"><Trophy size={32} /></div>
              )}
            </div>
            <h3 className="podium-name">{topThree[0].name}</h3>
            <span className="podium-sub">{topThree[0].college || topThree[0].leader || topThree[0].city}</span>
            <div className="podium-score gold">
              {topThree[0].points.toLocaleString()} pts
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="podium-card bronze glass-card">
            <div className="podium-rank-badge rank-3">3</div>
            <div className="podium-avatar-box">
              {topThree[2].avatar ? (
                <img src={topThree[2].avatar} alt={topThree[2].name} />
              ) : (
                <div className="podium-icon bronze"><Award size={28} /></div>
              )}
            </div>
            <h3 className="podium-name">{topThree[2].name}</h3>
            <span className="podium-sub">{topThree[2].college || topThree[2].leader || topThree[2].city}</span>
            <div className="podium-score bronze">
              {topThree[2].points.toLocaleString()} pts
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="glass-card controls-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="coord-input search-input"
            placeholder={`Search ${activeTab} by name or college...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Rankings Table */}
      <div className="glass-card table-responsive">
        <table className="coord-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>{activeTab === 'students' ? 'Student' : activeTab === 'teams' ? 'Team Name' : 'College'}</th>
              <th>{activeTab === 'students' ? 'College & Team' : activeTab === 'teams' ? 'College & Leader' : 'Location / State'}</th>
              <th>Tasks / Actions</th>
              <th>Total Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((item) => (
              <tr key={item.id} className="leaderboard-row">
                <td>
                  <span className={`table-rank-tag rank-${item.rank <= 3 ? item.rank : 'default'}`}>
                    #{item.rank}
                  </span>
                </td>
                <td>
                  <div className="table-student-info">
                    {item.avatar && (
                      <img src={item.avatar} alt={item.name} className="table-avatar" />
                    )}
                    <div>
                      <span className="table-name">{item.name}</span>
                      {item.code && <span className="table-sub">{item.code}</span>}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="table-college">
                    {item.college
                      ? `${item.college} ${item.teamName ? `• ${item.teamName}` : ''}`
                      : item.leader
                      ? `Leader: ${item.leader}`
                      : `${item.city || ''}, ${item.state || ''}`}
                  </span>
                </td>
                <td>
                  <span className="table-tasks">
                    {item.tasksCompleted ? `${item.tasksCompleted} completed` : `${item.studentsCount || 50} students`}
                  </span>
                </td>
                <td>
                  <span className="text-emerald-400 font-bold">
                    {item.points.toLocaleString()} pts
                  </span>
                </td>
                <td>
                  <button
                    className="coord-btn coord-btn-secondary coord-btn-sm"
                    onClick={() => {
                      if (activeTab === 'students') navigate(`/coordinator/students/${item.id}`);
                      else if (activeTab === 'teams') navigate(`/coordinator/teams/${item.id}`);
                      else navigate('/coordinator/colleges');
                    }}
                  >
                    View <ExternalLink size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

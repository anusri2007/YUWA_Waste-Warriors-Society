import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  Search,
  Filter,
  ArrowUpDown,
  Trophy,
  Award,
  Building2,
  CheckCircle2,
  TrendingUp,
  Download
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import TeamCard from './components/TeamCard';
import './Teams.css';

const Teams = () => {
  const navigate = useNavigate();
  const { teams, colleges } = useCoordinator();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank'); // 'rank', 'points', 'name', 'members'

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    return teams
      .filter((t) => {
        const matchesSearch =
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.leader.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCollege =
          selectedCollege === 'ALL' || t.college === selectedCollege;

        return matchesSearch && matchesCollege;
      })
      .sort((a, b) => {
        if (sortBy === 'rank') return a.rank - b.rank;
        if (sortBy === 'points') return b.points - a.points;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'members') return b.membersCount - a.membersCount;
        return 0;
      });
  }, [teams, searchQuery, selectedCollege, sortBy]);

  const topTeam = useMemo(() => {
    return [...teams].sort((a, b) => a.rank - b.rank)[0];
  }, [teams]);

  const totalMembers = useMemo(() => {
    return teams.reduce((acc, t) => acc + (t.membersCount || 0), 0);
  }, [teams]);

  const avgPoints = useMemo(() => {
    return Math.round(teams.reduce((acc, t) => acc + t.points, 0) / (teams.length || 1));
  }, [teams]);

  // Export Teams CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Rank,TeamCode,TeamName,College,Leader,MembersCount,Points,TasksCompleted']
        .concat(
          filteredTeams.map(
            (t) =>
              `${t.rank},"${t.code}","${t.name}","${t.college}","${t.leader}",${t.membersCount},${t.points},${t.tasksCompleted}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yuwa_teams_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="coord-page-container teams-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Users2 className="title-icon" /> Ecolympics Teams
          </h1>
          <p className="coord-page-subtitle">
            Track collaborative squads, aggregate team scores, and competitive milestones.
          </p>
        </div>
        <div className="coord-page-actions">
          <button className="coord-btn coord-btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Overview Stat Mini Cards */}
      <div className="teams-stats-row">
        <div className="team-stat-pill glass-card">
          <div className="stat-pill-icon cyan">
            <Users2 size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{teams.length}</span>
            <span className="stat-pill-lbl">Registered Teams</span>
          </div>
        </div>

        <div className="team-stat-pill glass-card">
          <div className="stat-pill-icon emerald">
            <Trophy size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{topTeam ? topTeam.name : 'N/A'}</span>
            <span className="stat-pill-lbl">Current Leader (Rank #1)</span>
          </div>
        </div>

        <div className="team-stat-pill glass-card">
          <div className="stat-pill-icon violet">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{totalMembers}</span>
            <span className="stat-pill-lbl">Total Squad Members</span>
          </div>
        </div>

        <div className="team-stat-pill glass-card">
          <div className="stat-pill-icon amber">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{avgPoints.toLocaleString()}</span>
            <span className="stat-pill-lbl">Avg. Team Points</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="glass-card controls-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="coord-input search-input"
            placeholder="Search by team name, code, leader, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group-wrap">
          {/* College Filter */}
          <div className="select-wrap">
            <Building2 size={16} className="select-icon" />
            <select
              className="coord-select"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
              <option value="ALL">All Colleges</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="select-wrap">
            <ArrowUpDown size={16} className="select-icon" />
            <select
              className="coord-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rank">Sort by Rank</option>
              <option value="points">Sort by Highest Points</option>
              <option value="members">Sort by Squad Size</option>
              <option value="name">Sort by Team Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="glass-card empty-state-box">
          <Users2 size={48} className="empty-icon" />
          <h3>No teams found</h3>
          <p>Try adjusting your search criteria or removing active filters.</p>
          <button
            className="coord-btn coord-btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCollege('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onViewDetails={(id) => navigate(`/coordinator/teams/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;


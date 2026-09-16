import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  Users,
  Users2,
  Trophy,
  MapPin,
  ExternalLink,
  Award,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import './Colleges.css';

const Colleges = () => {
  const navigate = useNavigate();
  const { colleges } = useCoordinator();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank'); // 'rank', 'points', 'students', 'name'

  // Extract unique states
  const states = useMemo(() => {
    const list = new Set(colleges.map((c) => c.state).filter(Boolean));
    return ['ALL', ...Array.from(list)];
  }, [colleges]);

  // Filtered colleges
  const filteredColleges = useMemo(() => {
    return colleges
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (c.coordinator && c.coordinator.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesState = selectedState === 'ALL' || c.state === selectedState;

        return matchesSearch && matchesState;
      })
      .sort((a, b) => {
        if (sortBy === 'rank') return a.rank - b.rank;
        if (sortBy === 'points') return b.points - a.points;
        if (sortBy === 'students') return b.studentsCount - a.studentsCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [colleges, searchQuery, selectedState, sortBy]);

  const totalColleges = colleges.length;
  const totalEnrolled = colleges.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  const leadingCollege = [...colleges].sort((a, b) => a.rank - b.rank)[0];

  return (
    <div className="coord-page-container colleges-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Building2 className="title-icon" /> Participating Institutions
          </h1>
          <p className="coord-page-subtitle">
            Manage participating colleges, campus leads, collective institutional scores, and regional standings.
          </p>
        </div>
      </div>

      {/* Stats Mini Row */}
      <div className="colleges-stats-row">
        <div className="college-stat-pill glass-card">
          <div className="stat-pill-icon cyan">
            <Building2 size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{totalColleges}</span>
            <span className="stat-pill-lbl">Participating Colleges</span>
          </div>
        </div>

        <div className="college-stat-pill glass-card">
          <div className="stat-pill-icon emerald">
            <Trophy size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{leadingCollege ? leadingCollege.name.slice(0, 24) + '...' : 'N/A'}</span>
            <span className="stat-pill-lbl">National Leader (Rank #1)</span>
          </div>
        </div>

        <div className="college-stat-pill glass-card">
          <div className="stat-pill-icon violet">
            <Users size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{totalEnrolled.toLocaleString()}</span>
            <span className="stat-pill-lbl">Enrolled Students</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="glass-card controls-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="coord-input search-input"
            placeholder="Search by college name, city, coordinator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group-wrap">
          {/* State Filter */}
          <div className="select-wrap">
            <MapPin size={16} className="select-icon" />
            <select
              className="coord-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'All States' : st}
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
              <option value="rank">Sort by Institutional Rank</option>
              <option value="points">Sort by Highest Points</option>
              <option value="students">Sort by Enrolled Students</option>
              <option value="name">Sort by College Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Colleges Grid */}
      {filteredColleges.length === 0 ? (
        <div className="glass-card empty-state-box">
          <Building2 size={48} className="empty-icon" />
          <h3>No institutions found</h3>
          <p>Try resetting your search query or state filter.</p>
          <button
            className="coord-btn coord-btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedState('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="colleges-grid">
          {filteredColleges.map((college) => (
            <div key={college.id} className="glass-card college-card">
              <div className="college-card-header">
                <div className="college-icon-box">
                  <Building2 size={24} />
                </div>
                <div className={`college-rank-tag rank-${college.rank <= 3 ? college.rank : 'default'}`}>
                  Rank #{college.rank}
                </div>
              </div>

              <div className="college-card-body">
                <h3 className="college-name">{college.name}</h3>
                <span className="college-location">
                  <MapPin size={14} /> {college.city || 'Campus'}, {college.state || 'India'}
                </span>

                <div className="college-coord-lead">
                  <UserCheck size={14} className="text-emerald-400" />
                  <span>Lead: {college.coordinator || 'Faculty In-Charge'}</span>
                </div>

                <div className="college-stats-grid">
                  <div className="c-stat-box">
                    <span className="c-stat-val">{college.studentsCount || 80}</span>
                    <span className="c-stat-lbl">Students</span>
                  </div>
                  <div className="c-stat-box">
                    <span className="c-stat-val">{college.teamsCount || 8}</span>
                    <span className="c-stat-lbl">Squads</span>
                  </div>
                  <div className="c-stat-box">
                    <span className="c-stat-val text-emerald-400 font-bold">
                      {college.points.toLocaleString()}
                    </span>
                    <span className="c-stat-lbl">Total Score</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Colleges;


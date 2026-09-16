import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  GraduationCap,
  Award,
  TrendingUp,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Mail
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import StudentCard from './components/StudentCard';
import StatusBadge from './components/StatusBadge';
import './Students.css';

const Students = () => {
  const navigate = useNavigate();
  const { students, colleges, teams } = useCoordinator();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank'); // 'rank', 'points', 'name', 'tasks'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.teamName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCollege =
          selectedCollege === 'ALL' || s.college === selectedCollege;

        const matchesStatus =
          selectedStatus === 'ALL' || s.status === selectedStatus;

        return matchesSearch && matchesCollege && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'rank') return a.rank - b.rank;
        if (sortBy === 'points') return b.points - a.points;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'tasks') return b.tasksCompleted - a.tasksCompleted;
        return 0;
      });
  }, [students, searchQuery, selectedCollege, selectedStatus, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Export CSV mock
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,RollNo,Email,College,Team,Points,Rank,Status,TasksCompleted']
        .concat(
          filteredStudents.map(
            (s) =>
              `"${s.name}","${s.rollNo}","${s.email}","${s.college}","${s.teamName}",${s.points},${s.rank},"${s.status}",${s.tasksCompleted}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yuwa_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="coord-page-container students-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <Users className="title-icon" /> Student Directory
          </h1>
          <p className="coord-page-subtitle">
            Monitor participant performance, task completions, and active rankings across colleges.
          </p>
        </div>
        <div className="coord-page-actions">
          <button className="coord-btn coord-btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Overview Stat Mini Cards */}
      <div className="students-stats-row">
        <div className="student-stat-pill glass-card">
          <div className="stat-pill-icon emerald">
            <Users size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{students.length}</span>
            <span className="stat-pill-lbl">Enrolled Students</span>
          </div>
        </div>

        <div className="student-stat-pill glass-card">
          <div className="stat-pill-icon cyan">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="stat-pill-num">
              {students.filter((s) => s.status === 'Active').length}
            </span>
            <span className="stat-pill-lbl">Active Today</span>
          </div>
        </div>

        <div className="student-stat-pill glass-card">
          <div className="stat-pill-icon violet">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="stat-pill-num">{colleges.length}</span>
            <span className="stat-pill-lbl">Colleges Represented</span>
          </div>
        </div>

        <div className="student-stat-pill glass-card">
          <div className="stat-pill-icon amber">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="stat-pill-num">
              {Math.round(students.reduce((acc, s) => acc + s.points, 0) / (students.length || 1))}
            </span>
            <span className="stat-pill-lbl">Avg. Points / Student</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Mode */}
      <div className="glass-card controls-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="coord-input search-input"
            placeholder="Search by student name, roll number, college, team..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-group-wrap">
          {/* College Filter */}
          <div className="select-wrap">
            <Building2 size={16} className="select-icon" />
            <select
              className="coord-select"
              value={selectedCollege}
              onChange={(e) => {
                setSelectedCollege(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Colleges</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="select-wrap">
            <Filter size={16} className="select-icon" />
            <select
              className="coord-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
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
              <option value="tasks">Sort by Tasks Done</option>
              <option value="name">Sort by Name (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Grid or Table */}
      {paginatedStudents.length === 0 ? (
        <div className="glass-card empty-state-box">
          <Users size={48} className="empty-icon" />
          <h3>No students found</h3>
          <p>Try adjusting your search query or removing active filters.</p>
          <button
            className="coord-btn coord-btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCollege('ALL');
              setSelectedStatus('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="students-grid">
          {paginatedStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={(id) => navigate(`/coordinator/students/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card table-responsive">
          <table className="coord-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>College</th>
                <th>Team</th>
                <th>Points</th>
                <th>Tasks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="student-row">
                  <td>
                    <span className={`table-rank-tag rank-${student.rank <= 3 ? student.rank : 'default'}`}>
                      #{student.rank}
                    </span>
                  </td>
                  <td>
                    <div className="table-student-info">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="table-avatar"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <span className="table-name">{student.name}</span>
                        <span className="table-sub">{student.rollNo}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-college">{student.college}</span>
                  </td>
                  <td>
                    <span className="table-team-badge">{student.teamName}</span>
                  </td>
                  <td>
                    <span className="table-points font-semibold text-emerald-400">
                      {student.points.toLocaleString()} pts
                    </span>
                  </td>
                  <td>
                    <span className="table-tasks">{student.tasksCompleted} completed</span>
                  </td>
                  <td>
                    <StatusBadge status={student.status} />
                  </td>
                  <td>
                    <button
                      className="coord-btn coord-btn-secondary coord-btn-sm"
                      onClick={() => navigate(`/coordinator/students/${student.id}`)}
                    >
                      View <ExternalLink size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredStudents.length > itemsPerPage && (
        <div className="pagination-bar">
          <span className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{' '}
            {filteredStudents.length} students
          </span>
          <div className="pagination-controls">
            <button
              className="coord-btn coord-btn-secondary coord-btn-sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-num-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="coord-btn coord-btn-secondary coord-btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;


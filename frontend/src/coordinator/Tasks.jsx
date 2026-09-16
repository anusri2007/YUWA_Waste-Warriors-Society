import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Sparkles,
  Layers,
  ArrowUpDown,
  FileCheck,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import TaskCard from './components/TaskCard';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const { tasks, deleteTask } = useCoordinator();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'Active', 'Upcoming', 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(tasks.map((t) => t.category));
    return ['ALL', ...Array.from(cats)];
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesTab = activeTab === 'ALL' || t.status === activeTab;
      const matchesCategory =
        selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [tasks, activeTab, selectedCategory, searchQuery]);

  // Delete handler
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="coord-page-container tasks-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <CheckSquare className="title-icon" /> Task Management
          </h1>
          <p className="coord-page-subtitle">
            Create, schedule, monitor participant completion, and allocate points for sustainability missions.
          </p>
        </div>
        <div className="coord-page-actions">
          <button
            className="coord-btn coord-btn-primary"
            onClick={() => navigate('/coordinator/tasks/create')}
          >
            <Plus size={16} /> Create New Task
          </button>
        </div>
      </div>

      {/* Tabs & Filter Header */}
      <div className="tasks-tabs-row">
        <div className="tasks-status-tabs">
          {['ALL', 'Active', 'Upcoming', 'Completed'].map((tab) => {
            const count =
              tab === 'ALL'
                ? tasks.length
                : tasks.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                className={`task-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'ALL' ? 'All Tasks' : tab}
                <span className="tab-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="glass-card controls-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="coord-input search-input"
            placeholder="Search tasks by title, category, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group-wrap">
          <div className="select-wrap">
            <Layers size={16} className="select-icon" />
            <select
              className="coord-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card empty-state-box">
          <CheckSquare size={48} className="empty-icon" />
          <h3>No tasks found</h3>
          <p>No tasks match your selected status or filter criteria.</p>
          <button
            className="coord-btn coord-btn-primary"
            onClick={() => navigate('/coordinator/tasks/create')}
          >
            <Plus size={16} /> Create Task Now
          </button>
        </div>
      ) : (
        <div className="tasks-cards-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onView={(id) => navigate(`/coordinator/tasks/${id}`)}
              onEdit={(id) => navigate(`/coordinator/tasks/${id}?edit=true`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CheckSquare,
  Sparkles,
  Calendar,
  Layers,
  Award,
  FileCheck,
  Target,
  Edit3,
  Trash2,
  Users,
  CheckCircle2,
  ExternalLink,
  Clock,
  X
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import StatusBadge from './components/StatusBadge';
import SubmissionCard from './components/SubmissionCard';
import './TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, submissions, updateTask, deleteTask, approveSubmission, rejectSubmission } = useCoordinator();

  const task = tasks.find((t) => String(t.id) === String(id));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    points: 0,
    deadline: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title,
        category: task.category,
        points: task.points,
        deadline: task.deadline,
        description: task.description,
        status: task.status
      });
    }
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true') {
      setIsEditModalOpen(true);
    }
  }, [task, location.search]);

  if (!task) {
    return (
      <div className="coord-page-container">
        <div className="glass-card not-found-box">
          <h2>Task Not Found</h2>
          <p>The requested task ID could not be found in the system.</p>
          <button className="coord-btn coord-btn-primary" onClick={() => navigate('/coordinator/tasks')}>
            <ArrowLeft size={16} /> Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  // Filter submissions for this task
  const taskSubmissions = submissions.filter(
    (s) => s.taskTitle === task.title || s.id.includes(String(task.id))
  );

  const completionPercent = task.targetSubmissions
    ? Math.min(Math.round((task.submissionsCount / task.targetSubmissions) * 100), 100)
    : 45;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateTask(task.id, editFormData);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? All linked records will be archived.')) {
      deleteTask(task.id);
      navigate('/coordinator/tasks');
    }
  };

  return (
    <div className="coord-page-container task-details-page">
      {/* Back Button */}
      <div className="back-nav-bar">
        <button className="back-btn" onClick={() => navigate('/coordinator/tasks')}>
          <ArrowLeft size={16} /> Back to Tasks
        </button>
      </div>

      {/* Task Hero Card */}
      <div className="glass-card task-hero-card">
        <div className="task-hero-top">
          <div className="task-hero-tags">
            <span className="task-cat-pill">{task.category}</span>
            <StatusBadge status={task.status} />
          </div>
          <div className="task-hero-actions">
            <button
              className="coord-btn coord-btn-secondary coord-btn-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit3 size={15} /> Edit Mission
            </button>
            <button
              className="coord-btn coord-btn-danger coord-btn-sm"
              onClick={handleDelete}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

        <h1 className="task-hero-title">{task.title}</h1>
        <p className="task-hero-desc">{task.description}</p>

        <div className="task-meta-stats-row">
          <div className="task-meta-item">
            <Award className="text-emerald-400" size={18} />
            <div>
              <span className="meta-lbl">Reward</span>
              <span className="meta-val text-emerald-400">+{task.points} Points</span>
            </div>
          </div>

          <div className="task-meta-item">
            <Calendar className="text-cyan-400" size={18} />
            <div>
              <span className="meta-lbl">Deadline</span>
              <span className="meta-val">{task.deadline}</span>
            </div>
          </div>

          <div className="task-meta-item">
            <Users className="text-violet-400" size={18} />
            <div>
              <span className="meta-lbl">Completions</span>
              <span className="meta-val">
                {task.submissionsCount} / {task.targetSubmissions || 50} Targets
              </span>
            </div>
          </div>

          <div className="task-meta-item">
            <Target className="text-amber-400" size={18} />
            <div>
              <span className="meta-lbl">Completion Rate</span>
              <span className="meta-val">{completionPercent}%</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="task-progress-box">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Task Criteria */}
      <div className="glass-card criteria-box">
        <h3 className="section-title">
          <FileCheck className="text-emerald-400" size={20} /> Verification & Submission Criteria
        </h3>
        <ul className="criteria-check-list">
          <li>Take clear high-resolution photographic proof with visible campus background.</li>
          <li>Ensure waste segregation bins are clearly labelled before and after sorting.</li>
          <li>Log the total weight of segregated recyclable materials in kilograms.</li>
          <li>Provide a short 2-3 sentence reflection on challenges faced during the drive.</li>
        </ul>
      </div>

      {/* Submissions for this Task */}
      <div className="task-submissions-section">
        <div className="section-header">
          <h3 className="section-title">
            <CheckCircle2 className="text-cyan-400" size={20} /> Submissions for this Mission (
            {taskSubmissions.length})
          </h3>
        </div>

        {taskSubmissions.length === 0 ? (
          <div className="glass-card empty-sub-box">
            <CheckSquare size={36} className="text-slate-500" />
            <p>No student submissions received for this task yet.</p>
          </div>
        ) : (
          <div className="submissions-grid-view">
            {taskSubmissions.map((sub) => (
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="coord-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="coord-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="coord-modal-header">
              <h3>Edit Task Mission</h3>
              <button
                className="coord-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-task-modal-form">
              <div className="form-group">
                <label className="coord-label">Task Title</label>
                <input
                  type="text"
                  className="coord-input"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="coord-label">Category</label>
                  <select
                    className="coord-select"
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, category: e.target.value })
                    }
                  >
                    <option value="Waste Segregation">Waste Segregation</option>
                    <option value="Waste Audit">Waste Audit</option>
                    <option value="Plastic-Free">Plastic-Free Campaign</option>
                    <option value="Composting">Composting & Organic</option>
                    <option value="E-Waste">E-Waste Drive</option>
                    <option value="Innovation Pitch">Innovation Pitch</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="coord-label">Reward Points</label>
                  <input
                    type="number"
                    className="coord-input"
                    value={editFormData.points}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        points: Number(e.target.value)
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="coord-label">Deadline</label>
                  <input
                    type="date"
                    className="coord-input"
                    value={editFormData.deadline}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, deadline: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="coord-label">Status</label>
                  <select
                    className="coord-select"
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="coord-label">Description</label>
                <textarea
                  rows="3"
                  className="coord-textarea"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                />
              </div>

              <div className="form-actions-bar">
                <button
                  type="button"
                  className="coord-btn coord-btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="coord-btn coord-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;


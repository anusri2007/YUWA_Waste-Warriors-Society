import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckSquare,
  Sparkles,
  Calendar,
  Layers,
  Award,
  FileCheck,
  Target,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import TaskCard from './components/TaskCard';
import './CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const { createTask } = useCoordinator();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Waste Segregation',
    points: 300,
    deadline: '2026-03-25',
    description: '',
    targetSubmissions: 50,
    submissionType: 'Photo (GPS tagged)',
    criteria: [
      'Take 3 clear photos of the segregation stations installed.',
      'Ensure waste bins are correctly labeled (Wet, Dry, E-Waste).',
      'Geotag must show college campus premises.'
    ]
  });

  const [newCriterion, setNewCriterion] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'points' || name === 'targetSubmissions' ? Number(value) : value
    }));
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setFormData((prev) => ({
        ...prev,
        criteria: [...prev.criteria, newCriterion.trim()]
      }));
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (idx) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== idx)
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Task title is required';
    if (!formData.description.trim()) errs.description = 'Task description is required';
    if (formData.points <= 0) errs.points = 'Points must be greater than 0';
    if (!formData.deadline) errs.deadline = 'Deadline date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    createTask({
      title: formData.title,
      category: formData.category,
      points: formData.points,
      deadline: formData.deadline,
      description: formData.description,
      submissionsCount: 0,
      targetSubmissions: formData.targetSubmissions || 50,
      status: 'Active',
      criteria: formData.criteria
    });

    navigate('/coordinator/tasks');
  };

  // Live preview task object
  const previewTask = {
    id: 999,
    title: formData.title || 'Untitled Mission Task',
    category: formData.category,
    points: formData.points || 100,
    deadline: formData.deadline || '2026-03-31',
    description: formData.description || 'Description of the task will be rendered here.',
    submissionsCount: 0,
    targetSubmissions: formData.targetSubmissions || 50,
    status: 'Active'
  };

  return (
    <div className="coord-page-container create-task-page">
      {/* Back Button */}
      <div className="back-nav-bar">
        <button className="back-btn" onClick={() => navigate('/coordinator/tasks')}>
          <ArrowLeft size={16} /> Back to Tasks
        </button>
      </div>

      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <CheckSquare className="title-icon" /> Create New Sustainability Mission
          </h1>
          <p className="coord-page-subtitle">
            Publish official challenges for students and squads to complete during Ecolympics.
          </p>
        </div>
      </div>

      <div className="create-task-layout">
        {/* Form Column */}
        <form className="glass-card create-task-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="form-section-title">
              <Sparkles size={18} className="text-emerald-400" /> Basic Details
            </h3>

            <div className="form-group">
              <label className="coord-label">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`coord-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Campus Single-Use Plastic Audit & Weigh-In"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="coord-label">Category</label>
                <select
                  name="category"
                  className="coord-select"
                  value={formData.category}
                  onChange={handleChange}
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
                  name="points"
                  min="50"
                  max="5000"
                  step="50"
                  className="coord-input"
                  value={formData.points}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="coord-label">Submission Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  className="coord-input"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="coord-label">Target Completions Goal</label>
                <input
                  type="number"
                  name="targetSubmissions"
                  min="5"
                  max="1000"
                  className="coord-input"
                  value={formData.targetSubmissions}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="coord-label">
                Task Description & Instructions <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                className={`coord-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe the steps students need to follow, safety requirements, and expected impact..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              <FileCheck size={18} className="text-cyan-400" /> Verification Criteria Checklist
            </h3>
            <p className="form-section-sub">
              Students must satisfy these requirements for submission approval.
            </p>

            <div className="criteria-list">
              {formData.criteria.map((crit, idx) => (
                <div key={idx} className="criteria-item">
                  <span className="crit-num">{idx + 1}</span>
                  <span className="crit-text">{crit}</span>
                  <button
                    type="button"
                    className="crit-remove-btn"
                    onClick={() => handleRemoveCriterion(idx)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-crit-box">
              <input
                type="text"
                className="coord-input"
                placeholder="Add verification rule (e.g. Must weigh collected bottles in kg)..."
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCriterion();
                  }
                }}
              />
              <button
                type="button"
                className="coord-btn coord-btn-secondary"
                onClick={handleAddCriterion}
              >
                <Plus size={16} /> Add Rule
              </button>
            </div>
          </div>

          <div className="form-actions-bar">
            <button
              type="button"
              className="coord-btn coord-btn-secondary"
              onClick={() => navigate('/coordinator/tasks')}
            >
              Cancel
            </button>
            <button type="submit" className="coord-btn coord-btn-primary">
              <Sparkles size={16} /> Publish Task to Students
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="preview-column">
          <div className="preview-sticky">
            <div className="preview-title-row">
              <span className="preview-tag">Live Card Preview</span>
            </div>
            <TaskCard task={previewTask} />

            <div className="glass-card preview-tips-box">
              <div className="tips-head">
                <Info size={16} className="text-emerald-400" />
                <h4>Coordinator Tip</h4>
              </div>
              <p>
                Tasks with clear geotagging requirements and structured photo guides receive 80% higher approval velocity on first submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;


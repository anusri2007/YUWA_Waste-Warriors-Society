import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Layers,
  ArrowUpDown,
  Download,
  Eye,
  MessageSquare,
  X
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import SubmissionCard from './components/SubmissionCard';
import StatusBadge from './components/StatusBadge';
import './Submissions.css';

const Submissions = () => {
  const navigate = useNavigate();
  const { submissions, tasks, approveSubmission, rejectSubmission } = useCoordinator();

  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected', 'ALL'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState('ALL');

  // Modal feedback state
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    submissionId: null,
    action: 'reject', // 'reject' or 'feedback'
    comment: ''
  });

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesTab = activeTab === 'ALL' || sub.status === activeTab;
      const matchesSearch =
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.studentRoll && sub.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTask = selectedTask === 'ALL' || sub.taskTitle === selectedTask;

      return matchesTab && matchesSearch && matchesTask;
    });
  }, [submissions, activeTab, searchQuery, selectedTask]);

  const counts = {
    Pending: submissions.filter((s) => s.status === 'Pending').length,
    Approved: submissions.filter((s) => s.status === 'Approved').length,
    Rejected: submissions.filter((s) => s.status === 'Rejected').length,
    ALL: submissions.length
  };

  const handleOpenFeedback = (id, action = 'reject') => {
    setFeedbackModal({
      isOpen: true,
      submissionId: id,
      action,
      comment: ''
    });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!feedbackModal.comment.trim()) return;

    rejectSubmission(feedbackModal.submissionId, feedbackModal.comment);
    setFeedbackModal({ isOpen: false, submissionId: null, action: 'reject', comment: '' });
  };

  // Export Submissions CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['SubmissionID,StudentName,RollNo,TaskTitle,Points,Status,SubmittedAt,ReviewNote']
        .concat(
          filteredSubmissions.map(
            (s) =>
              `"${s.id}","${s.studentName}","${s.studentRoll || ''}","${s.taskTitle}",${s.points},"${s.status}","${s.submittedAt}","${s.reviewNote || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yuwa_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="coord-page-container submissions-page">
      {/* Top Banner Header */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">
            <FileCheck className="title-icon" /> Submissions & Evidence Review
          </h1>
          <p className="coord-page-subtitle">
            Inspect photo proofs, geotags, verify metrics, and award Ecolympics scoring.
          </p>
        </div>
        <div className="coord-page-actions">
          <button className="coord-btn coord-btn-secondary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="submission-tabs-row">
        <div className="submission-status-tabs">
          <button
            className={`sub-tab-btn ${activeTab === 'Pending' ? 'active pending' : ''}`}
            onClick={() => setActiveTab('Pending')}
          >
            <Clock size={16} /> Pending Verification
            <span className="tab-pill pending">{counts.Pending}</span>
          </button>

          <button
            className={`sub-tab-btn ${activeTab === 'Approved' ? 'active approved' : ''}`}
            onClick={() => setActiveTab('Approved')}
          >
            <CheckCircle2 size={16} /> Approved
            <span className="tab-pill approved">{counts.Approved}</span>
          </button>

          <button
            className={`sub-tab-btn ${activeTab === 'Rejected' ? 'active rejected' : ''}`}
            onClick={() => setActiveTab('Rejected')}
          >
            <XCircle size={16} /> Revision Required / Rejected
            <span className="tab-pill rejected">{counts.Rejected}</span>
          </button>

          <button
            className={`sub-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Submissions
            <span className="tab-pill">{counts.ALL}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="glass-card controls-bar">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="coord-input search-input"
            placeholder="Search by student name, roll number, task title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group-wrap">
          <div className="select-wrap">
            <Layers size={16} className="select-icon" />
            <select
              className="coord-select"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="ALL">All Mission Tasks</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="glass-card empty-state-box">
          <FileCheck size={48} className="empty-icon" />
          <h3>No submissions in this queue</h3>
          <p>
            {activeTab === 'Pending'
              ? 'Great work! You are all caught up on pending reviews.'
              : 'Try clearing search filters or changing the active tab.'}
          </p>
          <button
            className="coord-btn coord-btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedTask('ALL');
              setActiveTab('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="submissions-list-container">
          {filteredSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onApprove={(id, pts) => approveSubmission(id, pts)}
              onReject={(id) => handleOpenFeedback(id, 'reject')}
              onFeedback={(id) => handleOpenFeedback(id, 'feedback')}
              onViewDetails={(id) => navigate(`/coordinator/submissions/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Feedback / Rejection Modal */}
      {feedbackModal.isOpen && (
        <div className="coord-modal-backdrop" onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}>
          <div className="coord-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="coord-modal-header">
              <h3>
                {feedbackModal.action === 'reject'
                  ? 'Request Changes / Reject Submission'
                  : 'Send Coordinator Feedback'}
              </h3>
              <button
                className="coord-modal-close"
                onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="feedback-modal-form">
              <p className="modal-instruction">
                Provide constructive feedback so the student can revise and re-upload the evidence.
              </p>

              <div className="form-group">
                <label className="coord-label">Coordinator Feedback & Reason</label>
                <textarea
                  rows="4"
                  className="coord-textarea"
                  placeholder="e.g., The photo proof is missing visible waste bin labels. Please re-upload with clear campus timestamp."
                  value={feedbackModal.comment}
                  onChange={(e) =>
                    setFeedbackModal({ ...feedbackModal, comment: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="coord-btn coord-btn-secondary"
                  onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
                >
                  Cancel
                </button>
                <button type="submit" className="coord-btn coord-btn-danger">
                  Submit Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;


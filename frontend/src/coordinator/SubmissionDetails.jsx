import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  MessageSquare,
  Building2,
  Users,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';
import { useCoordinator } from './CoordinatorContext';
import StatusBadge from './components/StatusBadge';
import './SubmissionDetails.css';

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    submissions,
    approveSubmission,
    rejectSubmission,
    requestSubmissionChanges
  } = useCoordinator();

  const submission = submissions.find((s) => String(s.id) === String(id));

  const [awardedPoints, setAwardedPoints] = useState(
    submission ? submission.points : 300
  );
  const [feedbackNote, setFeedbackNote] = useState(
    submission?.reviewNote || ''
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!submission) {
    return (
      <div className="coord-page-container">
        <div className="glass-card not-found-box">
          <h2>Submission Not Found</h2>
          <p>The submission record with ID "{id}" could not be located.</p>
          <button
            className="coord-btn coord-btn-primary"
            onClick={() => navigate('/coordinator/submissions')}
          >
            <ArrowLeft size={16} /> Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    approveSubmission(submission.id, Number(awardedPoints));
    navigate('/coordinator/submissions');
  };

  const handleReject = () => {
    if (!feedbackNote.trim()) {
      alert('Please provide a feedback note explaining the reason for rejection.');
      return;
    }
    rejectSubmission(submission.id, feedbackNote);
    navigate('/coordinator/submissions');
  };

  const handleRequestChanges = () => {
    if (!feedbackNote.trim()) {
      alert('Please provide instructions for what the student needs to revise.');
      return;
    }
    requestSubmissionChanges(submission.id, feedbackNote);
    navigate('/coordinator/submissions');
  };

  const images = submission.images && submission.images.length > 0
    ? submission.images
    : [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80'
      ];

  return (
    <div className="coord-page-container submission-details-page">
      {/* Back Button */}
      <div className="back-nav-bar">
        <button
          className="back-btn"
          onClick={() => navigate('/coordinator/submissions')}
        >
          <ArrowLeft size={16} /> Back to Submissions Queue
        </button>
      </div>

      {/* Main Evidence Dossier Card */}
      <div className="evidence-layout-grid">
        {/* Left: Media & Proof Evidence Viewer */}
        <div className="evidence-proofs-col">
          <div className="glass-card proof-viewer-card">
            <div className="proof-viewer-main">
              <img
                src={images[activeImageIdx]}
                alt="Submission evidence proof"
                className="proof-main-image"
              />
              <div className="geotag-overlay-pill">
                <MapPin size={14} className="text-emerald-400" />
                <span>
                  {submission.location || 'Campus Quad A • 12.9716° N, 77.5946° E'}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="proof-thumbnails-row">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={img} alt={`Proof thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Student Reflection & Notes */}
          <div className="glass-card student-reflection-card">
            <h3 className="section-title">
              <MessageSquare size={18} className="text-cyan-400" /> Student Reflection & Notes
            </h3>
            <p className="reflection-text">
              "{submission.notes ||
                'Our squad organized the 3-bin segregation drive at the student cafeteria. We sorted over 14.5 kg of recyclables and composted organic peelings at the botanical unit. All bins are now clearly labeled with QR guides.'}"
            </p>

            <div className="reflection-meta-grid">
              <div className="ref-meta-item">
                <Clock size={15} />
                <span>Submitted on {submission.submittedAt}</span>
              </div>
              <div className="ref-meta-item">
                <MapPin size={15} />
                <span>Geotag Verified: Passed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reviewer Panel & Scoring */}
        <div className="evidence-reviewer-col">
          {/* Student Header */}
          <div className="glass-card student-summary-card">
            <div className="sub-header-row">
              <span className="sub-id-tag">Submission #{submission.id}</span>
              <StatusBadge status={submission.status} />
            </div>

            <div className="student-profile-mini">
              <img
                src={
                  submission.studentAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={submission.studentName}
                className="student-mini-avatar"
              />
              <div>
                <h3 className="student-mini-name">{submission.studentName}</h3>
                <span className="student-mini-sub">
                  {submission.studentRoll || '22CS045'}
                </span>
              </div>
            </div>

            <div className="student-affiliation-pills">
              <div className="aff-pill">
                <Building2 size={14} />
                <span>{submission.college || 'National Institute of Engineering'}</span>
              </div>
              <div className="aff-pill">
                <Users size={14} />
                <span>Team: {submission.teamName || 'Green Pioneers'}</span>
              </div>
            </div>
          </div>

          {/* Mission Details */}
          <div className="glass-card mission-context-card">
            <span className="context-label">Mission Task</span>
            <h4 className="mission-title">{submission.taskTitle}</h4>
            <div className="mission-meta">
              <span className="cat-badge">{submission.category || 'Waste Segregation'}</span>
              <span className="points-avail">Max {submission.points} Points</span>
            </div>
          </div>

          {/* Action Decision Panel */}
          <div className="glass-card decision-panel-card">
            <h3 className="section-title">
              <Award size={18} className="text-emerald-400" /> Coordinator Scoring & Decision
            </h3>

            {/* Award Points Input */}
            <div className="form-group">
              <label className="coord-label">Points to Award</label>
              <div className="points-input-box">
                <input
                  type="number"
                  min="0"
                  max="2000"
                  step="50"
                  className="coord-input points-field"
                  value={awardedPoints}
                  onChange={(e) => setAwardedPoints(e.target.value)}
                />
                <span className="pts-suffix">PTS</span>
              </div>
            </div>

            {/* Feedback textarea */}
            <div className="form-group">
              <label className="coord-label">Coordinator Feedback / Review Notes</label>
              <textarea
                rows="4"
                className="coord-textarea"
                placeholder="Add notes for the student (mandatory if requesting changes or rejecting)..."
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
              />
            </div>

            {/* Decision Action Buttons */}
            <div className="decision-buttons-stack">
              <button
                type="button"
                className="coord-btn coord-btn-primary approve-action-btn"
                onClick={handleApprove}
              >
                <Check size={18} /> Approve & Award {awardedPoints} Points
              </button>

              <button
                type="button"
                className="coord-btn coord-btn-secondary request-changes-btn"
                onClick={handleRequestChanges}
              >
                <AlertTriangle size={16} /> Request Revisions / More Proof
              </button>

              <button
                type="button"
                className="coord-btn coord-btn-danger reject-action-btn"
                onClick={handleReject}
              >
                <XCircle size={16} /> Reject Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;


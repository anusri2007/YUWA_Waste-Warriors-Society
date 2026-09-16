import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Recycle,
  Award,
  Calendar,
  Image,
  Video,
  Search,
  X,
  Sparkles,
  Upload,
  ArrowRight,
  RotateCcw,
  Eye,
  Trash2,
  Users,
  MapPin,
  FileText
} from "lucide-react";
import { useStudent } from "./StudentContext";
import "./MySubmissions.css";

const MySubmissions = () => {
  const { submissions, handleDeleteSubmission } = useStudent();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("All"); // All | Approved | Pending | Rejected
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubModal, setSelectedSubModal] = useState(null);

  const statusList = ["All", "Approved", "Pending", "Rejected"];

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchStatus =
      filterStatus === "All" ||
      sub.status.toLowerCase() === filterStatus.toLowerCase() ||
      (filterStatus === "Pending" && sub.status === "Under Review");

    const q = searchQuery.toLowerCase();
    const matchSearch =
      sub.activityName.toLowerCase().includes(q) ||
      sub.id.toLowerCase().includes(q) ||
      (sub.reflection && sub.reflection.toLowerCase().includes(q));

    return matchStatus && matchSearch;
  });

  // Calculate Metrics
  const totalSubmissions = submissions.length;
  const approvedCount = submissions.filter((s) => s.status === "Approved").length;
  const pendingCount = submissions.filter((s) => s.status === "Pending" || s.status === "Under Review").length;
  const rejectedCount = submissions.filter((s) => s.status === "Rejected").length;
  const totalPointsEarned = submissions
    .filter((s) => s.status === "Approved")
    .reduce((acc, curr) => acc + (curr.points || 0), 0);
  const totalWasteDiverted = submissions
    .reduce((acc, curr) => acc + (parseFloat(curr.wasteCollectedKg) || 0), 0)
    .toFixed(1);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="sub-badge badge-approved">
            <CheckCircle2 size={13} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="sub-badge badge-rejected">
            <AlertTriangle size={13} /> Rejected
          </span>
        );
      default:
        return (
          <span className="sub-badge badge-pending">
            <Clock size={13} /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="my-submissions-page">
      {/* Hero Header */}
      <section className="submissions-hero glass-card">
        <div className="submissions-hero-info">
          <div className="sub-tagline-badge">
            <FileCheck size={14} className="text-emerald-400" />
            <span>FIELD ACTIVITY VERIFICATION LOGS</span>
          </div>
          <h1 className="submissions-title">My Field Submissions</h1>
          <p className="submissions-subtitle">
            Track evaluation status, jury score allocations, and digital evidence logs for your environmental actions.
          </p>
        </div>

        <Link to="/student/submit" className="eco-btn-primary new-sub-btn">
          <Upload size={16} />
          <span>Submit New Activity</span>
        </Link>
      </section>

      {/* 4 Summary Stat Cards */}
      <section className="sub-summary-grid">
        <div className="sub-stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Submissions</span>
            <FileCheck size={20} className="text-cyan-400" />
          </div>
          <div className="stat-value">{totalSubmissions}</div>
          <span className="stat-hint">{approvedCount} approved • {pendingCount} under review</span>
        </div>

        <div className="sub-stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">Points Awarded</span>
            <Award size={20} className="text-amber-400" />
          </div>
          <div className="stat-value text-amber-400">+{totalPointsEarned} pts</div>
          <span className="stat-hint">Direct league points verified</span>
        </div>

        <div className="sub-stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">Waste Diverted</span>
            <Recycle size={20} className="text-emerald-400" />
          </div>
          <div className="stat-value text-emerald-400">{totalWasteDiverted} kg</div>
          <span className="stat-hint">Diverted from city landfills</span>
        </div>

        <div className="sub-stat-card glass-card">
          <div className="stat-card-top">
            <span className="stat-label">Review Status</span>
            <Clock size={20} className="text-purple-400" />
          </div>
          <div className="stat-value text-purple-300">{pendingCount} Pending</div>
          <span className="stat-hint">Regional jury avg 24h turnaround</span>
        </div>
      </section>

      {/* Control Bar: Filters & Search */}
      <section className="sub-control-bar glass-card">
        <div className="sub-filter-pills">
          {statusList.map((st) => (
            <button
              key={st}
              type="button"
              className={`sub-pill-btn ${filterStatus === st ? "active" : ""}`}
              onClick={() => setFilterStatus(st)}
            >
              {st} {st === "All" ? `(${submissions.length})` : st === "Approved" ? `(${approvedCount})` : st === "Pending" ? `(${pendingCount})` : `(${rejectedCount})`}
            </button>
          ))}
        </div>

        <div className="sub-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search submissions by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* Submissions Grid */}
      <section className="submissions-cards-grid">
        {filteredSubmissions.map((sub) => (
          <div key={sub.id} className="sub-item-card glass-card">
            <div className="sub-card-header-row">
              <span className="sub-id-pill">{sub.id}</span>
              <div className="sub-header-right">
                <span className="sub-date-txt">
                  <Calendar size={13} /> {sub.submissionDate}
                </span>
                {getStatusBadge(sub.status)}
              </div>
            </div>

            <h3 className="sub-activity-title">{sub.activityName}</h3>

            {/* Evidence Chips Strip */}
            <div className="sub-evidence-chips">
              {sub.photos && sub.photos.length > 0 && (
                <span className="ev-chip">
                  <Image size={13} /> {sub.photos.length} Photo{sub.photos.length > 1 ? "s" : ""}
                </span>
              )}
              {sub.videos && sub.videos.length > 0 && (
                <span className="ev-chip chip-video">
                  <Video size={13} /> Video Clip
                </span>
              )}
              {sub.wasteCollectedKg > 0 && (
                <span className="ev-chip chip-waste">
                  <Recycle size={13} /> {sub.wasteCollectedKg} kg
                </span>
              )}
              {sub.hoursSpent > 0 && (
                <span className="ev-chip chip-time">
                  <Clock size={13} /> {sub.hoursSpent} hrs
                </span>
              )}
            </div>

            {/* Reflection preview */}
            {sub.reflection && (
              <p className="sub-reflection-snippet">
                "{sub.reflection.length > 120 ? sub.reflection.slice(0, 120) + "..." : sub.reflection}"
              </p>
            )}

            {/* Evaluator feedback if present */}
            {sub.evaluatorFeedback && (
              <div className={`evaluator-note-box ${sub.status === "Rejected" ? "note-rejected" : ""}`}>
                <span className="eval-note-label">Jury Feedback:</span>
                <p className="eval-note-text">"{sub.evaluatorFeedback}"</p>
              </div>
            )}

            {/* Card Footer Actions */}
            <div className="sub-card-footer-row">
              <div className="sub-points-tag">
                <Award size={15} className="text-amber-400" />
                <span>
                  {sub.status === "Approved" ? `+${sub.points} Points` : sub.status === "Rejected" ? "0 Points" : `Pending +${sub.points} pts`}
                </span>
              </div>

              <div className="sub-actions-group">
                <button
                  type="button"
                  className="btn-view-evidence"
                  onClick={() => setSelectedSubModal(sub)}
                >
                  <Eye size={14} />
                  <span>Inspect Evidence</span>
                </button>

                {sub.status === "Rejected" && (
                  <button
                    type="button"
                    className="btn-resubmit-action"
                    onClick={() => navigate("/student/submit", { state: { taskId: sub.taskId } })}
                  >
                    <RotateCcw size={14} />
                    <span>Resubmit</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-delete-sub"
                  onClick={() => handleDeleteSubmission(sub.id)}
                  title="Delete submission record"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="no-submissions-card glass-card">
            <Sparkles size={40} className="text-emerald-400" />
            <h3>No submissions found</h3>
            <p>You have not logged any activity under this filter.</p>
            <Link to="/student/submit" className="eco-btn-primary">
              <Upload size={16} />
              <span>Submit Your First Activity</span>
            </Link>
          </div>
        )}
      </section>

      {/* Submission Details Modal */}
      {selectedSubModal && (
        <div
          className="sub-modal-backdrop"
          onClick={() => setSelectedSubModal(null)}
        >
          <div
            className="sub-modal-card glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-top-bar">
              <div className="modal-title-wrap">
                <span className="sub-id-pill">{selectedSubModal.id}</span>
                <h2>{selectedSubModal.activityName}</h2>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedSubModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-scroll-content">
              {/* Status and Points Banner */}
              <div className="modal-status-banner">
                <div>
                  <span className="modal-banner-lbl">Verification Status</span>
                  <div className="modal-status-pill-wrap">
                    {getStatusBadge(selectedSubModal.status)}
                  </div>
                </div>

                <div>
                  <span className="modal-banner-lbl">Allocated Score</span>
                  <div className="modal-score-val text-amber-400">
                    +{selectedSubModal.points} Points
                  </div>
                </div>

                <div>
                  <span className="modal-banner-lbl">Submission Date</span>
                  <div className="modal-date-val">
                    <Calendar size={14} /> {selectedSubModal.submissionDate}
                  </div>
                </div>
              </div>

              {/* Quantified Impact Metrics Strip */}
              <div className="modal-metrics-grid">
                <div className="m-metric-box">
                  <Recycle size={18} className="text-emerald-400" />
                  <div>
                    <span className="m-lbl">Waste Diverted</span>
                    <strong className="m-val">{selectedSubModal.wasteCollectedKg || 0} kg</strong>
                  </div>
                </div>

                <div className="m-metric-box">
                  <Clock size={18} className="text-amber-400" />
                  <div>
                    <span className="m-lbl">Hours Dedicated</span>
                    <strong className="m-val">{selectedSubModal.hoursSpent || 0} hours</strong>
                  </div>
                </div>

                <div className="m-metric-box">
                  <Users size={18} className="text-purple-400" />
                  <div>
                    <span className="m-lbl">People Mobilized</span>
                    <strong className="m-val">{selectedSubModal.peopleInvolved || 1} volunteers</strong>
                  </div>
                </div>

                <div className="m-metric-box">
                  <MapPin size={18} className="text-blue-400" />
                  <div>
                    <span className="m-lbl">Distance Covered</span>
                    <strong className="m-val">{selectedSubModal.distanceCoveredKm || 0} km</strong>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              {selectedSubModal.photos && selectedSubModal.photos.length > 0 && (
                <div className="modal-section-group">
                  <h4 className="modal-section-title">
                    <Image size={16} className="text-cyan-400" />
                    Uploaded Evidence Photos ({selectedSubModal.photos.length})
                  </h4>
                  <div className="modal-photos-gallery">
                    {selectedSubModal.photos.map((photoUrl, idx) => (
                      <div key={idx} className="modal-photo-item">
                        <img
                          src={photoUrl}
                          alt={`Evidence ${idx + 1}`}
                          className="modal-gallery-img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Reflection */}
              {selectedSubModal.reflection && (
                <div className="modal-section-group">
                  <h4 className="modal-section-title">
                    <FileText size={16} className="text-emerald-400" />
                    Personal Reflection & Field Observations
                  </h4>
                  <div className="modal-reflection-box">
                    <p>{selectedSubModal.reflection}</p>
                  </div>
                </div>
              )}

              {/* Evaluator Feedback */}
              {selectedSubModal.evaluatorFeedback && (
                <div className="modal-section-group">
                  <h4 className="modal-section-title">
                    <Sparkles size={16} className="text-amber-400" />
                    Regional Evaluation Jury Review
                  </h4>
                  <div className="modal-feedback-box">
                    <p>"{selectedSubModal.evaluatorFeedback}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="modal-footer-actions">
              <button
                type="button"
                className="eco-btn-secondary"
                onClick={() => setSelectedSubModal(null)}
              >
                Close Details
              </button>

              {selectedSubModal.status === "Rejected" && (
                <button
                  type="button"
                  className="eco-btn-primary"
                  onClick={() => {
                    const taskId = selectedSubModal.taskId;
                    setSelectedSubModal(null);
                    navigate("/student/submit", { state: { taskId } });
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Resubmit Activity Evidence</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;


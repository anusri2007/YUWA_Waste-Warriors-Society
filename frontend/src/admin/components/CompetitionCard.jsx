import StatusBadge from "./StatusBadge";

function CompetitionCard({ competition, onEdit, onDelete, onViewDetails }) {
  return (
    <div className="admin-comp-card">
      <div className="admin-comp-card-top">
        <span className="admin-status-badge badge-neutral" style={{ fontSize: "11px" }}>
          {competition.category}
        </span>
        <StatusBadge status={competition.status} />
      </div>

      <h3
        style={{ cursor: "pointer", color: "#10251d" }}
        onClick={() => onViewDetails && onViewDetails(competition)}
        title="Click to view details"
      >
        {competition.title}
      </h3>

      <p className="admin-comp-desc">{competition.description}</p>

      <div className="admin-comp-meta">
        <div>
          <span>TIMELINE</span>
          <strong>
            {competition.startDate} to {competition.endDate}
          </strong>
        </div>
        <div>
          <span>MAX SQUAD SIZE</span>
          <strong>{competition.maxTeamSize} Members / Team</strong>
        </div>
      </div>

      <div className="admin-comp-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => onViewDetails && onViewDetails(competition)}
        >
          View Details
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => onEdit && onEdit(competition)}
        >
          Edit
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-danger admin-btn-sm"
          onClick={() => onDelete && onDelete(competition)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CompetitionCard;

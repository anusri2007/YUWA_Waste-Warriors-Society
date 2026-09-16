import StatusBadge from "./StatusBadge";

function CompetitionTable({ competitions, onEdit, onDelete, onViewDetails }) {
  if (!competitions || competitions.length === 0) {
    return (
      <div className="admin-empty-state">
        <div className="admin-empty-icon">🏆</div>
        <h3>No competitions found</h3>
        <p>Try adjusting your search criteria or create a new environmental challenge.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Competition Title</th>
            <th>Environmental Category</th>
            <th>Timeline</th>
            <th>Max Team Size</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((comp) => (
            <tr key={comp.id}>
              <td>
                <strong
                  style={{ cursor: "pointer", color: "#197642" }}
                  onClick={() => onViewDetails && onViewDetails(comp)}
                  title="Click to view details"
                >
                  {comp.title}
                </strong>
                <div style={{ fontSize: "11px", color: "#648078", marginTop: "2px" }}>
                  {comp.description.slice(0, 75)}...
                </div>
              </td>

              <td>
                <span className="admin-status-badge badge-neutral">{comp.category}</span>
              </td>

              <td style={{ fontSize: "12px", color: "#648078" }}>
                {comp.startDate} → {comp.endDate}
              </td>

              <td>{comp.maxTeamSize} Members</td>

              <td>
                <StatusBadge status={comp.status} />
              </td>

              <td>
                <div className="admin-table-actions" style={{ justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onViewDetails && onViewDetails(comp)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onEdit && onEdit(comp)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => onDelete && onDelete(comp)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompetitionTable;


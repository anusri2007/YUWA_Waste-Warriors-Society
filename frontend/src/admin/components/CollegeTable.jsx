import StatusBadge from "./StatusBadge";

function CollegeTable({
  colleges,
  onEdit,
  onDelete,
  onAssignCoordinator,
  onViewDetails,
}) {
  if (!colleges || colleges.length === 0) {
    return (
      <div className="admin-empty-state">
        <div className="admin-empty-icon">🏛️</div>
        <h3>No colleges found</h3>
        <p>Try adjusting your search criteria or register a new college.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>College / Institution</th>
            <th>Location</th>
            <th>Contact Person</th>
            <th>Assigned Coordinator</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((col) => (
            <tr key={col.id}>
              <td>
                <strong
                  style={{ cursor: "pointer", color: "#197642" }}
                  onClick={() => onViewDetails && onViewDetails(col)}
                  title="Click to view details"
                >
                  {col.name}
                </strong>
                <div style={{ fontSize: "11px", color: "#648078", marginTop: "3px" }}>
                  {col.studentsCount || 0} Students enrolled • {col.teamsCount || 0} Teams
                </div>
              </td>

              <td>{col.location}</td>

              <td>
                <div style={{ fontWeight: 600 }}>{col.contactPerson}</div>
                <div style={{ fontSize: "11px", color: "#648078" }}>
                  {col.email} • {col.phone}
                </div>
              </td>

              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {col.assignedCoordinator === "Unassigned" ? (
                    <span style={{ color: "#a76b00", fontSize: "12px", fontWeight: 600 }}>
                      ⚠ Unassigned
                    </span>
                  ) : (
                    <span style={{ fontWeight: 500 }}>{col.assignedCoordinator}</span>
                  )}
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ padding: "3px 7px", fontSize: "11px" }}
                    onClick={() => onAssignCoordinator && onAssignCoordinator(col)}
                    title="Assign or change coordinator"
                  >
                    Assign
                  </button>
                </div>
              </td>

              <td>
                <StatusBadge status={col.status} />
              </td>

              <td>
                <div className="admin-table-actions" style={{ justifyContent: "flex-end" }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onViewDetails && onViewDetails(col)}
                    title="View full college profile"
                  >
                    View
                  </button>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onEdit && onEdit(col)}
                    title="Edit college details"
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => onDelete && onDelete(col)}
                    title="Delete college"
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

export default CollegeTable;

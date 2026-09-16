import { useState, useMemo } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import CompetitionCard from "../components/CompetitionCard";
import CompetitionTable from "../components/CompetitionTable";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import FormModal from "../components/FormModal";
import ConfirmationModal from "../components/ConfirmationModal";
import StatusBadge from "../components/StatusBadge";
import { useAdmin } from "../context/AdminContext";

const CATEGORIES = [
  "Waste Segregation",
  "Plastic Collection",
  "Tree Plantation",
  "Community Cleanup",
  "E-Waste Drive",
];

const STATUSES = ["Draft", "Upcoming", "Active", "Completed"];

function Competitions() {
  const {
    competitions,
    addCompetition,
    updateCompetition,
    deleteCompetition,
  } = useAdmin();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [deletingComp, setDeletingComp] = useState(null);
  const [viewingComp, setViewingComp] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Waste Segregation",
    startDate: "",
    endDate: "",
    rules: "",
    maxTeamSize: 4,
    status: "Active",
  });
  const [formError, setFormError] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        comp.title.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" || comp.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        comp.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [competitions, search, categoryFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      title: "",
      description: "",
      category: "Waste Segregation",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      rules: "Participating teams must follow YUWA environmental guidelines, record geo-tagged proof, and obtain faculty sign-off.",
      maxTeamSize: 4,
      status: "Upcoming",
    });
    setFormError("");
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (comp) => {
    setEditingComp(comp);
    setFormData({
      title: comp.title,
      description: comp.description,
      category: comp.category,
      startDate: comp.startDate,
      endDate: comp.endDate,
      rules: comp.rules,
      maxTeamSize: comp.maxTeamSize,
      status: comp.status,
    });
    setFormError("");
  };

  // Handle Form Submit (Create or Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Competition title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Description is required.");
      return;
    }
    if (!formData.startDate) {
      setFormError("Start date is required.");
      return;
    }
    if (!formData.endDate) {
      setFormError("End date is required.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setFormError("End date cannot be earlier than start date.");
      return;
    }

    if (editingComp) {
      updateCompetition(editingComp.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        rules: formData.rules.trim(),
        maxTeamSize: Number(formData.maxTeamSize) || 4,
        status: formData.status,
      });
      showToast(`Competition "${formData.title}" updated successfully.`);
      setEditingComp(null);
    } else {
      addCompetition(formData);
      showToast(`New competition "${formData.title}" published.`);
      setIsCreateModalOpen(false);
    }
  };

  // Handle Delete Confirm
  const handleConfirmDelete = () => {
    if (deletingComp) {
      deleteCompetition(deletingComp.id);
      showToast(`Competition "${deletingComp.title}" deleted.`);
      setDeletingComp(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader title="Competitions Management" subtitle="Environmental Challenges & Sprints" />

        <div className="admin-content">
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="admin-toast">
              <span>✓</span>
              {toastMessage}
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="admin-page-header">
            <div>
              <span className="admin-workspace-label">Environmental Challenges</span>
              <h1>Active & Scheduled Competitions</h1>
              <p>
                Launch, monitor, and configure nationwide inter-collegiate sustainability competitions and sprints.
              </p>
            </div>

            <div className="admin-table-actions">
              <div
                style={{
                  display: "flex",
                  border: "1px solid #dce7e2",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  style={{
                    background: viewMode === "grid" ? "#197642" : "white",
                    color: viewMode === "grid" ? "white" : "#648078",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  onClick={() => setViewMode("grid")}
                >
                  Grid View
                </button>
                <button
                  type="button"
                  style={{
                    background: viewMode === "table" ? "#197642" : "white",
                    color: viewMode === "table" ? "white" : "#648078",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  onClick={() => setViewMode("table")}
                >
                  Table View
                </button>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleOpenCreate}
              >
                + Create Competition
              </button>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="admin-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search competitions by title, category, or task..."
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <FilterDropdown
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                allLabel="All Categories"
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              />

              <FilterDropdown
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                allLabel="All Statuses"
                options={STATUSES.map((s) => ({ label: s, value: s }))}
              />

              {(search || categoryFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ alignSelf: "center", height: "48px" }}
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* COMPETITIONS LIST (GRID OR TABLE) */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h2>
                  Competitions Catalog ({filteredCompetitions.length})
                </h2>
                <p>Configured sustainability challenges available for team enrolment</p>
              </div>
            </div>

            {filteredCompetitions.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">🏆</div>
                <h3>No competitions found</h3>
                <p>No competitions match your selected search or category filters.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="admin-competitions-grid">
                {filteredCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id}
                    competition={comp}
                    onEdit={handleOpenEdit}
                    onDelete={setDeletingComp}
                    onViewDetails={setViewingComp}
                  />
                ))}
              </div>
            ) : (
              <CompetitionTable
                competitions={filteredCompetitions}
                onEdit={handleOpenEdit}
                onDelete={setDeletingComp}
                onViewDetails={setViewingComp}
              />
            )}
          </div>

          {/* =========================================================
              MODAL: CREATE / EDIT COMPETITION
             ========================================================= */}
          <FormModal
            isOpen={isCreateModalOpen || !!editingComp}
            title={editingComp ? `Edit: ${editingComp.title}` : "Create New Competition"}
            maxWidth="680px"
            onClose={() => {
              setIsCreateModalOpen(false);
              setEditingComp(null);
            }}
          >
            {formError && (
              <div
                style={{
                  background: "#ffe3e5",
                  color: "#c9363f",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  fontWeight: 600,
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="admin-form-group">
                <label>Competition Title *</label>
                <input
                  type="text"
                  placeholder="E.g., National Campus Waste Segregation Championship 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Environmental Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Competition Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description & Scope *</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the core objective and environmental impact target of this challenge..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Max Squad Size (Students / Team)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxTeamSize}
                    onChange={(e) =>
                      setFormData({ ...formData, maxTeamSize: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Guidelines & Verification Rules</label>
                <textarea
                  rows="3"
                  placeholder="Detail the criteria required for submission, geotagging requirements, and disposal receipts..."
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                />
              </div>

              <div
                className="admin-modal-footer"
                style={{ margin: "20px -24px -24px", borderRadius: "0 0 16px 16px" }}
              >
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingComp(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingComp ? "Save Changes" : "Publish Competition"}
                </button>
              </div>
            </form>
          </FormModal>

          {/* =========================================================
              MODAL: VIEW COMPETITION DETAILS
             ========================================================= */}
          {viewingComp && (
            <FormModal
              isOpen={!!viewingComp}
              title={`Competition Dossier: ${viewingComp.title}`}
              maxWidth="680px"
              onClose={() => setViewingComp(null)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8faf9",
                    padding: "16px",
                    borderRadius: "10px",
                  }}
                >
                  <div>
                    <span className="admin-status-badge badge-neutral" style={{ marginBottom: "6px" }}>
                      {viewingComp.category}
                    </span>
                    <h3 style={{ margin: 0, fontSize: "17px", color: "#10251d" }}>
                      {viewingComp.title}
                    </h3>
                  </div>
                  <StatusBadge status={viewingComp.status} />
                </div>

                <div style={{ background: "#fbfdfc", padding: "14px", borderRadius: "10px", border: "1px solid #edf2ef" }}>
                  <div style={{ fontSize: "11px", color: "#648078", fontWeight: 700, marginBottom: "4px" }}>
                    MISSION OBJECTIVE
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#384d43", lineHeight: 1.5 }}>
                    {viewingComp.description}
                  </p>
                </div>

                <div className="admin-form-row">
                  <div style={{ background: "#f8faf9", padding: "12px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "11px", color: "#648078" }}>CHALLENGE WINDOW</div>
                    <strong>{viewingComp.startDate} to {viewingComp.endDate}</strong>
                  </div>

                  <div style={{ background: "#f8faf9", padding: "12px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "11px", color: "#648078" }}>SQUAD LIMIT</div>
                    <strong>Up to {viewingComp.maxTeamSize} Members per Team</strong>
                  </div>
                </div>

                <div style={{ background: "#f8faf9", padding: "14px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#648078", fontWeight: 700, marginBottom: "4px" }}>
                    OFFICIAL RULES & VERIFICATION
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4b5e54", lineHeight: 1.5 }}>
                    {viewingComp.rules}
                  </p>
                </div>

                <div className="admin-modal-footer" style={{ margin: "14px -24px -24px" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => {
                      setViewingComp(null);
                      handleOpenEdit(viewingComp);
                    }}
                  >
                    Edit Challenge Details
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={() => setViewingComp(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </FormModal>
          )}

          {/* =========================================================
              MODAL: CONFIRM DELETE
             ========================================================= */}
          <ConfirmationModal
            isOpen={!!deletingComp}
            title="Delete Competition"
            message={`Are you sure you want to delete "${deletingComp?.title}"? All associated leaderboard points and registered submissions under this challenge will be affected.`}
            confirmText="Delete Competition"
            cancelText="Cancel"
            isDanger={true}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingComp(null)}
          />
        </div>
      </main>
    </div>
  );
}

export default Competitions;

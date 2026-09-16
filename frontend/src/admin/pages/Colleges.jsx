import { useState, useMemo } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import CollegeTable from "../components/CollegeTable";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import FormModal from "../components/FormModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAdmin } from "../context/AdminContext";

function Colleges() {
  const {
    colleges,
    coordinators,
    addCollege,
    updateCollege,
    deleteCollege,
    assignCoordinator,
  } = useAdmin();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [deletingCollege, setDeletingCollege] = useState(null);
  const [assigningCollege, setAssigningCollege] = useState(null);
  const [viewingCollege, setViewingCollege] = useState(null);

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactPerson: "",
    email: "",
    phone: "",
    assignedCoordinator: "Unassigned",
    studentsCount: "",
    teamsCount: "",
    status: "Active",
  });
  const [formError, setFormError] = useState("");

  // Assign Coordinator input state
  const [selectedCoordName, setSelectedCoordName] = useState("");

  // Filtered colleges list
  const filteredColleges = useMemo(() => {
    return colleges.filter((col) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        col.name.toLowerCase().includes(q) ||
        col.location.toLowerCase().includes(q) ||
        col.contactPerson.toLowerCase().includes(q) ||
        col.assignedCoordinator.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || col.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [colleges, search, statusFilter]);

  // Handle Add College Open
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      location: "",
      contactPerson: "",
      email: "",
      phone: "",
      assignedCoordinator: "Unassigned",
      studentsCount: "",
      teamsCount: "",
      status: "Active",
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  // Handle Edit College Open
  const handleOpenEdit = (col) => {
    setEditingCollege(col);
    setFormData({
      name: col.name,
      location: col.location,
      contactPerson: col.contactPerson,
      email: col.email,
      phone: col.phone,
      assignedCoordinator: col.assignedCoordinator || "Unassigned",
      studentsCount: col.studentsCount || "",
      teamsCount: col.teamsCount || "",
      status: col.status || "Active",
    });
    setFormError("");
  };

  // Form Validation & Submit (Add or Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Institution name is required.");
      return;
    }
    if (!formData.location.trim()) {
      setFormError("Location / City is required.");
      return;
    }
    if (!formData.contactPerson.trim()) {
      setFormError("Contact person name is required.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("A valid institutional email is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setFormError("Contact phone number is required.");
      return;
    }

    if (editingCollege) {
      updateCollege(editingCollege.id, {
        name: formData.name.trim(),
        location: formData.location.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        assignedCoordinator: formData.assignedCoordinator,
        studentsCount: Number(formData.studentsCount) || 0,
        teamsCount: Number(formData.teamsCount) || 0,
        status: formData.status,
      });
      showToast(`College "${formData.name}" updated successfully.`);
      setEditingCollege(null);
    } else {
      addCollege(formData);
      showToast(`New college "${formData.name}" registered successfully.`);
      setIsAddModalOpen(false);
    }
  };

  // Handle Delete Confirm
  const handleConfirmDelete = () => {
    if (deletingCollege) {
      deleteCollege(deletingCollege.id);
      showToast(`College "${deletingCollege.name}" removed.`);
      setDeletingCollege(null);
    }
  };

  // Handle Assign Coordinator Open
  const handleOpenAssign = (col) => {
    setAssigningCollege(col);
    setSelectedCoordName(col.assignedCoordinator || "Unassigned");
  };

  // Handle Assign Coordinator Save
  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (assigningCollege) {
      assignCoordinator(assigningCollege.id, selectedCoordName);
      showToast(
        `Coordinator "${selectedCoordName}" assigned to ${assigningCollege.name}.`
      );
      setAssigningCollege(null);
    }
  };

  const approvedCoordinators = coordinators.filter((c) => c.status === "Approved");

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader title="Colleges Management" subtitle="Partner Institutions & Campuses" />

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
              <span className="admin-workspace-label">Institution Directory</span>
              <h1>Registered Colleges & Campuses</h1>
              <p>
                Manage partner colleges, institutional contacts, student quotas, and faculty coordinator assignments.
              </p>
            </div>

            <button className="admin-btn admin-btn-primary" onClick={handleOpenAdd}>
              + Add New College
            </button>
          </div>

          {/* SEARCH & FILTER TOOLBAR */}
          <div className="admin-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search by college name, city, contact or coordinator..."
            />

            <FilterDropdown
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              allLabel="All Statuses"
              options={[
                { label: "Active Institutions", value: "active" },
                { label: "Inactive Institutions", value: "inactive" },
              ]}
            />
          </div>

          {/* COLLEGES TABLE CARD */}
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h2>Institutions List ({filteredColleges.length})</h2>
                <p>Overview of all collegiate partners enrolled in YUWA campaigns</p>
              </div>

              {(search || statusFilter !== "all") && (
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            <CollegeTable
              colleges={filteredColleges}
              onEdit={handleOpenEdit}
              onDelete={setDeletingCollege}
              onAssignCoordinator={handleOpenAssign}
              onViewDetails={setViewingCollege}
            />
          </div>

          {/* =========================================================
              MODAL: ADD / EDIT COLLEGE
             ========================================================= */}
          <FormModal
            isOpen={isAddModalOpen || !!editingCollege}
            title={editingCollege ? `Edit: ${editingCollege.name}` : "Register New College"}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingCollege(null);
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
                <label>College / University Name *</label>
                <input
                  type="text"
                  placeholder="E.g., National Institute of Technology"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Location (City, State) *</label>
                  <input
                    type="text"
                    placeholder="E.g., Bengaluru, Karnataka"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Institutional Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Contact Person (Dean / Faculty) *</label>
                  <input
                    type="text"
                    placeholder="E.g., Dr. R. Verma"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Contact Email *</label>
                  <input
                    type="email"
                    placeholder="E.g., contact@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Contact Phone *</label>
                  <input
                    type="text"
                    placeholder="E.g., +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Assigned Coordinator</label>
                  <select
                    value={formData.assignedCoordinator}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedCoordinator: e.target.value })
                    }
                  >
                    <option value="Unassigned">Unassigned</option>
                    {approvedCoordinators.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.college})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Estimated Student Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="E.g., 250"
                    value={formData.studentsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, studentsCount: e.target.value })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Registered Teams Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="E.g., 6"
                    value={formData.teamsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, teamsCount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: "20px -24px -24px", borderRadius: "0 0 16px 16px" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCollege(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingCollege ? "Save Changes" : "Register College"}
                </button>
              </div>
            </form>
          </FormModal>

          {/* =========================================================
              MODAL: ASSIGN COORDINATOR
             ========================================================= */}
          <FormModal
            isOpen={!!assigningCollege}
            title={`Assign Coordinator: ${assigningCollege?.name || ""}`}
            onClose={() => setAssigningCollege(null)}
          >
            <form onSubmit={handleSaveAssign}>
              <p style={{ fontSize: "13px", color: "#648078", marginBottom: "16px" }}>
                Select an approved faculty or volunteer coordinator to manage YUWA environmental campaigns at this institution.
              </p>

              <div className="admin-form-group">
                <label>Select Coordinator</label>
                <select
                  value={selectedCoordName}
                  onChange={(e) => setSelectedCoordName(e.target.value)}
                >
                  <option value="Unassigned">-- Unassigned --</option>
                  {approvedCoordinators.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} — {c.email} ({c.college})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-modal-footer" style={{ margin: "24px -24px -24px" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setAssigningCollege(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Assign Coordinator
                </button>
              </div>
            </form>
          </FormModal>

          {/* =========================================================
              MODAL: VIEW COLLEGE DETAILS
             ========================================================= */}
          {viewingCollege && (
            <FormModal
              isOpen={!!viewingCollege}
              title={`Institutional Profile: ${viewingCollege.name}`}
              onClose={() => setViewingCollege(null)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#f8faf9", padding: "16px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#648078" }}>LOCATION</div>
                  <strong style={{ fontSize: "15px" }}>{viewingCollege.location}</strong>
                </div>

                <div className="admin-form-row">
                  <div style={{ background: "#f8faf9", padding: "14px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#648078" }}>CONTACT PERSON</div>
                    <strong>{viewingCollege.contactPerson}</strong>
                    <div style={{ fontSize: "12px", color: "#648078", marginTop: "4px" }}>
                      {viewingCollege.email} • {viewingCollege.phone}
                    </div>
                  </div>

                  <div style={{ background: "#f8faf9", padding: "14px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#648078" }}>FACULTY COORDINATOR</div>
                    <strong>{viewingCollege.assignedCoordinator}</strong>
                    <div style={{ fontSize: "12px", color: "#648078", marginTop: "4px" }}>
                      Status: {viewingCollege.status}
                    </div>
                  </div>
                </div>

                <div className="admin-form-row">
                  <div style={{ background: "#f0f8f3", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "#197642" }}>
                      {viewingCollege.studentsCount || 0}
                    </div>
                    <div style={{ fontSize: "12px", color: "#4b6757" }}>Students Enrolled</div>
                  </div>

                  <div style={{ background: "#f0f8f3", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "#197642" }}>
                      {viewingCollege.teamsCount || 0}
                    </div>
                    <div style={{ fontSize: "12px", color: "#4b6757" }}>Participating Teams</div>
                  </div>
                </div>

                <div className="admin-modal-footer" style={{ margin: "16px -24px -24px" }}>
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => {
                      setViewingCollege(null);
                      handleOpenEdit(viewingCollege);
                    }}
                  >
                    Edit College Details
                  </button>
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setViewingCollege(null)}
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
            isOpen={!!deletingCollege}
            title="Delete College"
            message={`Are you sure you want to delete "${deletingCollege?.name}"? All associated team and student records will be disassociated from this college.`}
            confirmText="Delete College"
            cancelText="Cancel"
            isDanger={true}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingCollege(null)}
          />
        </div>
      </main>
    </div>
  );
}

export default Colleges;

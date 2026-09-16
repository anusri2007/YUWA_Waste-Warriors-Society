import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUpDown, Plus, X, ListTodo } from "lucide-react";
import { useStudent } from "../StudentContext";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";

const Tasks = () => {
  const { tasks } = useStudent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("deadline"); // deadline | points | status

  const statusFilters = [
    "All",
    "Not Started",
    "In Progress",
    "Submitted",
    "Under Review",
    "Approved",
    "Rejected",
    "Completed"
  ];

  const categories = [
    "All",
    "Waste segregation",
    "Clean-up drives",
    "Street plays",
    "Poster making",
    "Community interaction",
    "Waste recovery",
    "Awareness campaigns"
  ];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (selectedStatus !== "All") {
      if (selectedStatus === "Completed") {
        if (task.status !== "Approved" && task.status !== "Completed") return false;
      } else if (task.status !== selectedStatus) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== "All" && task.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "points") {
      return b.points - a.points;
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    // Default deadline
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <div className="eco-tasks-page">
      {/* Top Header Card */}
      <section className="tasks-hero-header">
        <div className="tasks-hero-text">
          <h2>Environmental Action Tasks</h2>
          <p>
            Complete high-impact field initiatives, verify waste diversion, and earn points for your team in YUWA Ecolympics.
          </p>
        </div>

        <Link to="/student/submit" className="eco-btn-primary">
          <Plus size={16} />
          <span>Submit Evidence</span>
        </Link>
      </section>

      {/* Filter and Search Controls */}
      <section className="tasks-control-panel">
        <div className="search-and-sort-row">
          <div className="task-search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by action, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchTerm("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="task-sort-select-box">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks by"
            >
              <option value="deadline">Sort by Deadline (Earliest)</option>
              <option value="points">Sort by Points (Highest)</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="status-filter-scroll">
          <span className="filter-group-label">Status:</span>
          <div className="filter-pills-row">
            {statusFilters.map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-pill-btn ${selectedStatus === st ? "active-pill" : ""}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-filter-scroll">
          <span className="filter-group-label">Category:</span>
          <div className="filter-pills-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-pill-btn ${selectedCategory === cat ? "active-cat-pill" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tasks Count & Results */}
      <div className="tasks-count-bar">
        <span className="tasks-count-text">
          Showing <strong>{sortedTasks.length}</strong> of {tasks.length} tasks
        </span>
        {(selectedStatus !== "All" || selectedCategory !== "All" || searchTerm) && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setSelectedStatus("All");
              setSelectedCategory("All");
              setSearchTerm("");
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="tasks-card-grid">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {sortedTasks.length === 0 && (
        <EmptyState
          icon={ListTodo}
          title="No tasks match your filter criteria"
          description="Try selecting a different status or clear your search keyword."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedStatus("All");
            setSelectedCategory("All");
            setSearchTerm("");
          }}
        />
      )}
    </div>
  );
};

export default Tasks;

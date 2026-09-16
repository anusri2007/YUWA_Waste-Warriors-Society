import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, Award, CheckCircle, ArrowRight, X, Sparkles, Filter } from "lucide-react";
import { useStudent } from "./StudentContext";

const AvailableTasks = ({ onSelectTask }) => {
  const { tasks, setSelectedTaskId } = useStudent();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Environment", "Community", "Awareness", "Innovation"];

  const availableTasks = tasks.filter((t) => t.status === "Available");

  const filteredTasks = availableTasks.filter((task) => {
    const matchCat = selectedCategory === "All" || task.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleViewTask = (task) => {
    setSelectedTaskId(task.id);
    if (onSelectTask) {
      onSelectTask(task.id);
    } else {
      navigate("/student/tasks/details");
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Hard":
        return <span className="diff-badge diff-hard">Hard</span>;
      case "Medium":
        return <span className="diff-badge diff-med">Medium</span>;
      default:
        return <span className="diff-badge diff-easy">Easy</span>;
    }
  };

  return (
    <div className="available-tasks-subview">
      {/* Search & Category Filter Bar */}
      <div className="tasks-filter-glass-bar glass-card">
        <div className="tasks-search-input-wrap">
          <Search size={16} className="search-icon-glass" />
          <input
            type="text"
            placeholder="Search tasks by title, category, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn-clear-txt"
              onClick={() => setSearchTerm("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="category-pills-wrap">
          <span className="cat-label-txt">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-glass-pill ${selectedCategory === cat ? "active-pill" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Available Tasks Grid */}
      <div className="available-tasks-grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-glass-card glass-card">
            <div className="task-glass-top">
              <span className="task-cat-pill-glass">{task.category}</span>
              <div className="task-top-right">
                {getDifficultyBadge(task.difficulty)}
                <span className="task-pts-tag-gold">
                  <Award size={13} className="text-amber-400" />
                  <strong>+{task.points} pts</strong>
                </span>
              </div>
            </div>

            <h3 className="task-glass-title">{task.title}</h3>
            <p className="task-glass-desc">{task.description}</p>

            <div className="task-glass-meta">
              <span className="meta-deadline">
                <Calendar size={13} />
                <span>Due: <strong>{task.deadline}</strong></span>
              </span>
            </div>

            <div className="task-glass-actions">
              <button
                type="button"
                className="btn-view-task-glass"
                onClick={() => handleViewTask(task)}
              >
                <span>View Task</span>
                <ArrowRight size={14} />
              </button>

              <Link
                to="/student/submit"
                state={{ taskId: task.id }}
                className="btn-quick-submit-glass"
              >
                Submit
              </Link>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="no-tasks-box glass-card">
            <Sparkles size={36} className="text-emerald-400" />
            <h4>No tasks match your filter</h4>
            <p>Try clearing your search keyword or switching category tabs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableTasks;

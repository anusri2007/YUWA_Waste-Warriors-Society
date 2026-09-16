import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, CheckCheck, ListTodo } from "lucide-react";
import AvailableTasks from "./AvailableTasks";
import TaskDetails from "./TaskDetails";
import CompletedTasks from "./CompletedTasks";
import "./Tasks.css";

const Tasks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab directly from URL path
  const getActiveTab = () => {
    if (location.pathname.includes("/available")) return "available";
    if (location.pathname.includes("/details")) return "details";
    if (location.pathname.includes("/completed")) return "completed";
    return "available";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab) => {
    if (tab === "available") navigate("/student/tasks/available");
    else if (tab === "details") navigate("/student/tasks/details");
    else if (tab === "completed") navigate("/student/tasks/completed");
  };

  return (
    <div className="tasks-main-page-container">
      {/* Tab Navigation Pill Bar */}
      <div className="tasks-nav-tabs-bar glass-card">
        <div className="tabs-pill-container">
          <button
            type="button"
            className={`task-tab-btn ${activeTab === "available" ? "active-tab" : ""}`}
            onClick={() => handleTabChange("available")}
          >
            <ListTodo size={17} />
            <span>Available Tasks</span>
          </button>

          <button
            type="button"
            className={`task-tab-btn ${activeTab === "details" ? "active-tab" : ""}`}
            onClick={() => handleTabChange("details")}
          >
            <FileText size={17} />
            <span>Task Details</span>
          </button>

          <button
            type="button"
            className={`task-tab-btn ${activeTab === "completed" ? "active-tab" : ""}`}
            onClick={() => handleTabChange("completed")}
          >
            <CheckCheck size={17} />
            <span>Completed Tasks</span>
          </button>
        </div>
      </div>

      {/* Render Subview based on activeTab */}
      <div className="tasks-subview-content">
        {activeTab === "available" && (
          <AvailableTasks onSelectTask={() => handleTabChange("details")} />
        )}
        {activeTab === "details" && <TaskDetails />}
        {activeTab === "completed" && <CompletedTasks />}
      </div>
    </div>
  );
};

export default Tasks;

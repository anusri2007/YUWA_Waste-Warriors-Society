import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Calendar, Award, Check, Sparkles } from "lucide-react";
import { useStudent } from "./StudentContext";

const CompletedTasks = () => {
  const { tasks } = useStudent();
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return (
    <div className="completed-tasks-subview">
      <div className="completed-summary-bar glass-card">
        <div className="summary-text-pair">
          <CheckCircle2 size={24} className="text-emerald-400" />
          <div>
            <h3>Completed Challenges ({completedTasks.length})</h3>
            <p>Verified environmental tasks submitted by your squad</p>
          </div>
        </div>

        <div className="completed-pts-total">
          <span>Earned Points:</span>
          <strong>+{completedTasks.reduce((acc, curr) => acc + curr.points, 0)} pts</strong>
        </div>
      </div>

      <div className="completed-cards-grid">
        {completedTasks.map((task) => (
          <div key={task.id} className="completed-task-card glass-card">
            <div className="completed-card-top">
              <span className="task-cat-pill-glass">{task.category}</span>
              <span className="completed-pill-green">
                <Check size={12} /> Completed
              </span>
            </div>

            <h4 className="completed-task-title">{task.title}</h4>
            <p className="completed-task-desc">{task.description}</p>

            <div className="completed-meta-row">
              <span className="comp-date-text">
                <Calendar size={13} /> Completed: <strong>{task.completedDate || "Earlier"}</strong>
              </span>

              <span className="comp-pts-badge text-emerald-400">
                <Award size={14} /> +{task.points} pts
              </span>
            </div>
          </div>
        ))}

        {completedTasks.length === 0 && (
          <div className="no-tasks-box glass-card">
            <Sparkles size={36} className="text-emerald-400" />
            <h4>No completed tasks yet</h4>
            <p>Select an available task to start making an impact!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;

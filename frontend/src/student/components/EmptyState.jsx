import React from "react";
import { FolderOpen, ArrowRight } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no items to display at this moment.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="eco-empty-state">
      <div className="empty-icon-wrap">
        <Icon size={36} className="empty-icon text-emerald-600" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="empty-action-btn" onClick={onAction}>
          <span>{actionLabel}</span>
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
};

export default EmptyState;

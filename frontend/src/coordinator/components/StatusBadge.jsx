import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Sparkles, Check, Flame } from "lucide-react";

const StatusBadge = ({ status = "Pending", size = "normal" }) => {
  const normalized = status.toLowerCase();

  if (normalized === "approved" || normalized === "completed" || normalized === "active") {
    return (
      <span className={`status-badge-glass badge-green ${size}`}>
        <CheckCircle2 size={size === "small" ? 12 : 14} />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "pending" || normalized === "in progress" || normalized === "under review") {
    return (
      <span className={`status-badge-glass badge-amber ${size}`}>
        <Clock size={size === "small" ? 12 : 14} />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className={`status-badge-glass badge-red ${size}`}>
        <AlertTriangle size={size === "small" ? 12 : 14} />
        <span>{status}</span>
      </span>
    );
  }

  if (normalized === "upcoming") {
    return (
      <span className={`status-badge-glass badge-cyan ${size}`}>
        <Sparkles size={size === "small" ? 12 : 14} />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className={`status-badge-glass badge-neutral ${size}`}>
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;


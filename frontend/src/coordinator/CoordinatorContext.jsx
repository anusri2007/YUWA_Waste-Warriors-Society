import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import {
  initialCoordinator,
  initialStats,
  initialCompetition,
  initialStudents,
  initialTeams,
  initialTasks,
  initialSubmissions,
  initialLeaderboards,
  initialColleges,
  initialNotifications,
  participationChartData,
  pointsAnalyticsData
} from "./data/mockData";

const CoordinatorContext = createContext(null);

export const CoordinatorProvider = ({ children }) => {
  const [coordinator, setCoordinator] = useState(initialCoordinator);
  const [stats, setStats] = useState(initialStats);
  const [competition, setCompetition] = useState(initialCompetition);
  const [students, setStudents] = useState(initialStudents);
  const [teams, setTeams] = useState(initialTeams);
  const [tasks, setTasks] = useState(initialTasks);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [leaderboards, setLeaderboards] = useState(initialLeaderboards);
  const [colleges, setColleges] = useState(initialColleges);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [feedbackModalSubmission, setFeedbackModalSubmission] = useState(null);

  // Keep the page-facing models consistent with the core dashboard data.  A
  // few coordinator views use richer display names than the shared mock data.
  const activeCompetition = {
    ...competition,
    name: competition.title,
    description: competition.subtitle,
    daysLeft: competition.daysRemaining,
    prizePool: "₹1,75,000 in awards"
  };

  const coordinatorProfile = {
    ...coordinator,
    designation: coordinator.designation || coordinator.role,
    department: coordinator.department || "Environmental Sciences & Sustainability",
    college: coordinator.college || coordinator.organization,
    badge: coordinator.badge || "Verified National Coordinator"
  };

  const analyticsData = {
    participationTrend: participationChartData.map((item) => ({
      date: item.week,
      submissions: item.completedActivities,
      activeUsers: item.activeStudents
    })),
    categoryBreakdown: [
      { name: "Community", value: 28 },
      { name: "Environment", value: 34 },
      { name: "Awareness", value: 22 },
      { name: "Innovation", value: 16 }
    ]
  };

  // Approve Submission
  const approveSubmission = (submissionId, scoreOverride = null, feedback = "") => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;
    if (targetSub.status !== "Pending") {
      toast.error("Only pending submissions can be approved.");
      return;
    }

    const requestedScore = scoreOverride !== null ? Number(scoreOverride) : (targetSub.points || 100);
    const awardedScore = Number.isFinite(requestedScore) && requestedScore >= 0
      ? requestedScore
      : (targetSub.points || 100);

    // Update submission
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: "Approved",
              score: awardedScore,
              evaluatorFeedback: feedback || "Verified and approved by Coordinator."
            }
          : s
      )
    );

    // Update Student points
    setStudents((prev) =>
      prev.map((stu) =>
        stu.name === targetSub.studentName || stu.email === targetSub.studentEmail
          ? {
              ...stu,
              points: stu.points + awardedScore,
              tasksCompleted: stu.tasksCompleted + 1
            }
          : stu
      )
    );

    // Update Team points
    if (targetSub.team) {
      setTeams((prev) =>
        prev.map((t) =>
          t.name === targetSub.team || t.id === targetSub.teamId
            ? {
                ...t,
                points: t.points + awardedScore,
                completedTasks: t.completedTasks + 1,
                progress: Math.min(100, Math.round(((t.completedTasks + 1) / (t.completedTasks + t.pendingTasks || 40)) * 100))
              }
            : t
        )
      );
    }

    // Update overall Stats
    setStats((prev) => ({
      ...prev,
      pendingSubmissions: Math.max(0, prev.pendingSubmissions - 1),
      completedTasks: prev.completedTasks + 1,
      totalPoints: prev.totalPoints + awardedScore
    }));

    toast.success(`Submission ${submissionId} approved (+${awardedScore} pts awarded)!`, {
      icon: "✅"
    });
  };

  // Reject Submission with Feedback
  const rejectSubmission = (submissionId, feedback = "") => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub || targetSub.status !== "Pending") {
      toast.error("Only pending submissions can be rejected.");
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: "Rejected",
              score: 0,
              evaluatorFeedback: feedback || "Submission rejected due to incomplete or unverifiable evidence."
            }
          : s
      )
    );

    setStats((prev) => ({
      ...prev,
      pendingSubmissions: Math.max(0, prev.pendingSubmissions - 1)
    }));

    toast.error(`Submission ${submissionId} marked as Rejected.`, {
      icon: "❌"
    });
  };

  // Request Changes / Under Review
  const requestSubmissionChanges = (submissionId, feedback) => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub || targetSub.status !== "Pending") {
      toast.error("Feedback can only be requested for a pending submission.");
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: "Pending",
              evaluatorFeedback: feedback || "Additional evidence requested by coordinator."
            }
          : s
      )
    );

    toast(`Feedback sent to student for revision.`, {
      icon: "💬"
    });
  };

  // Create Task
  const createTask = (taskData) => {
    const newTaskId = `task-${tasks.length + 1}`;
    const newTask = {
      id: newTaskId,
      title: taskData.title,
      category: taskData.category || "Community",
      difficulty: taskData.difficulty || "Medium",
      description: taskData.description,
      instructions: taskData.instructions || "",
      points: parseInt(taskData.points, 10) || 100,
      startDate: taskData.startDate || new Date().toISOString().split("T")[0],
      deadline: taskData.deadline || "2026-09-30",
      status: taskData.status || "Active",
      participants: 0,
      submissionsCount: 0,
      completionRate: 0,
      submissionType: taskData.submissionType || ["Photo", "Description"],
      requirements: taskData.requirements || ["High-res photo proof", "Written summary"]
    };

    setTasks((prev) => [newTask, ...prev]);

    toast.success(`Task "${newTask.title}" created successfully!`, {
      icon: "🌱"
    });

    return newTask;
  };

  // Update Task
  const updateTask = (taskId, updatedData) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
    );
    toast.success("Task updated successfully!");
  };

  // Delete Task
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.success("Task removed from active championship.");
  };

  // Update Profile
  const updateCoordinatorProfile = (formData) => {
    setCoordinator((prev) => ({ ...prev, ...formData }));
    toast.success("Coordinator profile updated successfully!", { icon: "✨" });
  };

  // Notification actions
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read!");
  };

  const deleteNotification = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    toast.success("Notification removed.");
  };

  return (
    <CoordinatorContext.Provider
      value={{
        coordinator,
        coordinatorProfile,
        stats,
        competition,
        activeCompetition,
        students,
        teams,
        tasks,
        submissions,
        leaderboards,
        colleges,
        notifications,
        participationChartData,
        pointsAnalyticsData,
        analyticsData,
        feedbackModalSubmission,
        setFeedbackModalSubmission,
        approveSubmission,
        rejectSubmission,
        requestSubmissionChanges,
        createTask,
        updateTask,
        deleteTask,
        updateCoordinatorProfile,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification
      }}
    >
      {children}
    </CoordinatorContext.Provider>
  );
};

export const useCoordinator = () => {
  const context = useContext(CoordinatorContext);
  if (!context) {
    throw new Error("useCoordinator must be used within CoordinatorProvider");
  }
  return context;
};

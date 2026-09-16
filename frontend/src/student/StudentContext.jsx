import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import {
  initialStudent,
  initialCompetition,
  initialTeam,
  initialPointsActivities,
  pointsHistoryChartData,
  progressMetrics,
  initialTasks,
  initialSubmissions,
  initialLeaderboards,
  initialAchievements,
  initialNotifications,
  initialCourses,
  upcomingEvents
} from "./data/mockData";

const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(initialStudent);
  const [competition, setCompetition] = useState(initialCompetition);
  const [team, setTeam] = useState(initialTeam);
  const [pointsActivities, setPointsActivities] = useState(initialPointsActivities);
  const [tasks, setTasks] = useState(initialTasks);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [leaderboards, setLeaderboards] = useState(initialLeaderboards);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [courses, setCourses] = useState(initialCourses);
  const [events, setEvents] = useState(upcomingEvents);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Submit Activity Handler
  const handleActivitySubmit = (data) => {
    const newSubId = `SUB-${Math.floor(100 + Math.random() * 900)}`;
    const taskMatch = tasks.find((t) => t.id === data.taskId);
    const earnedPoints = taskMatch ? taskMatch.points : 100;

    const newSub = {
      id: newSubId,
      activityName: taskMatch ? taskMatch.title : (data.customActivityName || data.description || "Field Climate Action"),
      taskId: data.taskId || "custom-task",
      submissionDate: data.activityDate || new Date().toISOString().split("T")[0],
      status: "Pending",
      points: earnedPoints,
      hasPhoto: (data.photos && data.photos.length > 0) || (data.files && data.files.length > 0),
      hasVideo: (data.videos && data.videos.length > 0) || (data.files && data.files.some(f => f.isVideo)),
      photos: data.photos || (data.files ? data.files.filter(f => !f.isVideo).map(f => f.previewUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600") : []),
      videos: data.videos || (data.files ? data.files.filter(f => f.isVideo).map(f => f.name) : []),
      hoursSpent: parseFloat(data.hoursSpent) || 2,
      peopleInvolved: parseInt(data.peopleInvolved, 10) || 1,
      wasteCollectedKg: parseFloat(data.wasteCollectedKg) || 0,
      distanceCoveredKm: parseFloat(data.distanceCoveredKm) || 0,
      reflection: data.reflection || "",
      evaluatorFeedback: "Submission received. Assigned to Regional Jury."
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Update student points & team points
    setStudent((prev) => ({
      ...prev,
      points: prev.points + earnedPoints,
      weeklyPoints: prev.weeklyPoints + earnedPoints,
      tasksCompleted: prev.tasksCompleted + 1,
      tasksPending: Math.max(0, prev.totalTasks - (prev.tasksCompleted + 1))
    }));

    setTeam((prev) => ({
      ...prev,
      points: prev.points + earnedPoints,
      completedTasks: prev.completedTasks + 1
    }));

    // Add to points activities
    const newPointEntry = {
      id: `pa-${Date.now()}`,
      activity: `Submitted: ${newSub.activityName}`,
      date: "Just now",
      points: earnedPoints,
      type: "task"
    };
    setPointsActivities((prev) => [newPointEntry, ...prev]);

    // Update task status if matched
    if (data.taskId && data.taskId !== "custom") {
      setTasks((prev) =>
        prev.map((t) => (t.id === data.taskId ? { ...t, status: "Completed", completedDate: "Today" } : t))
      );
    }

    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `Submitted: ${newSub.activityName}`,
      message: `Your evidence for ${newSub.activityName} has been submitted for jury review (+${earnedPoints} pts).`,
      date: "Just now",
      read: false,
      type: "assignment"
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toast.success("Activity submitted successfully! Points pending verification.", {
      icon: "🌱",
      duration: 4000
    });

    return newSub;
  };

  // Update profile
  const handleUpdateProfile = (formData) => {
    setStudent((prev) => ({ ...prev, ...formData }));
    toast.success("Profile updated successfully!", { icon: "✨" });
  };

  // Notification handlers
  const handleMarkNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read!");
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed.");
  };

  // Delete submission
  const handleDeleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    toast.success("Submission removed.");
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        competition,
        setCompetition,
        team,
        setTeam,
        pointsActivities,
        setPointsActivities,
        pointsHistoryChartData,
        progressMetrics,
        tasks,
        setTasks,
        submissions,
        setSubmissions,
        leaderboards,
        setLeaderboards,
        achievements,
        setAchievements,
        notifications,
        setNotifications,
        courses,
        setCourses,
        events,
        setEvents,
        selectedTaskId,
        setSelectedTaskId,
        handleActivitySubmit,
        handleUpdateProfile,
        handleMarkNotificationRead,
        handleMarkAllNotificationsRead,
        handleDeleteNotification,
        handleDeleteSubmission
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return context;
};

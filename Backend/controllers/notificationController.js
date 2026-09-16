const Notification = require("../models/Notification");
const Team = require("../models/Team");
const notificationService = require("../services/notificationService");
const { NOTIFICATION_TYPES, ROLES } = require("../utils/constants");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get current user's notifications
// @route   GET /api/notifications/my
// @access  Authenticated
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.userId })
      .populate("senderId", "name email role")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return sendSuccess(res, "Notifications retrieved successfully", {
      unreadCount,
      notifications
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to retrieve notifications", 500);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Authenticated
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipientId: req.user.userId
    });

    if (!notification) {
      return sendError(res, "Notification not found", 404);
    }

    notification.read = true;
    await notification.save();

    return sendSuccess(res, "Notification marked as read", notification);
  } catch (error) {
    return sendError(res, error.message || "Failed to mark notification as read", 500);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Authenticated
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.userId, read: false },
      { read: true }
    );

    return sendSuccess(res, "All notifications marked as read", {});
  } catch (error) {
    return sendError(res, error.message || "Failed to mark all as read", 500);
  }
};

// @desc    Send a nudge to a team
// @route   POST /api/notifications/nudge
// @access  Coordinator / Admin
const nudgeTeam = async (req, res) => {
  try {
    const { teamId, message } = req.body;

    if (!teamId || !message) {
      return sendError(res, "teamId and message are required", 400);
    }

    // Support Mongo ObjectId or TEAM-xxx
    let team = null;
    if (teamId.match(/^[0-9a-fA-F]{24}$/)) {
      team = await Team.findById(teamId);
    }
    if (!team) {
      team = await Team.findOne({ teamId: teamId.toUpperCase() });
    }

    if (!team) {
      return sendError(res, "Team not found", 404);
    }

    // Permission check: Coordinator can only nudge teams in their own college
    if (
      req.user.role === ROLES.COORDINATOR &&
      team.collegeId.toString() !== req.user.collegeId
    ) {
      return sendError(
        res,
        "Access denied: You can only nudge teams from your own college",
        403
      );
    }

    if (!team.members || team.members.length === 0) {
      return sendError(res, "This team currently has no student members to nudge", 400);
    }

    const senderTitle =
      req.user.role === ROLES.ADMIN ? "Admin Notice" : "Coordinator Nudge";

    const createdNotifications = await notificationService.notifyTeamMembers({
      team,
      senderId: req.user.userId,
      type: NOTIFICATION_TYPES.TEAM_NUDGE,
      title: `${senderTitle}: ${team.teamName}`,
      message: message.trim(),
      relatedEntity: { entityType: "Team", entityId: team._id }
    });

    return sendSuccess(
      res,
      `Nudge sent successfully to ${createdNotifications.length} team members`,
      {
        teamId: team.teamId,
        teamName: team.teamName,
        membersNotified: createdNotifications.length,
        message: message.trim()
      },
      201
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to send nudge", 500);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  nudgeTeam
};

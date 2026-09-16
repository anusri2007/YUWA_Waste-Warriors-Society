const Notification = require("../models/Notification");
const { NOTIFICATION_TYPES } = require("../utils/constants");

class NotificationService {
  /**
   * Create a single notification
   */
  async notifyUser({
    recipientId,
    senderId = null,
    type = NOTIFICATION_TYPES.SYSTEM,
    title,
    message,
    relatedEntity = null
  }) {
    return await Notification.create({
      recipientId,
      senderId,
      type,
      title,
      message,
      relatedEntity
    });
  }

  /**
   * Send notification to all team members
   */
  async notifyTeamMembers({
    team,
    senderId,
    type = NOTIFICATION_TYPES.TEAM_NUDGE,
    title,
    message,
    relatedEntity = null
  }) {
    if (!team || !Array.isArray(team.members) || team.members.length === 0) {
      return [];
    }

    const notifications = team.members.map((memberId) => ({
      recipientId: memberId,
      senderId,
      type,
      title,
      message,
      relatedEntity: relatedEntity || { entityType: "Team", entityId: team._id }
    }));

    return await Notification.insertMany(notifications);
  }
}

module.exports = new NotificationService();

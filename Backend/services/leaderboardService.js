const mongoose = require("mongoose");
const Team = require("../models/Team");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const { EVALUATION_DECISION, SUBMISSION_STATUS } = require("../utils/constants");

class LeaderboardService {
  /**
   * Dynamically aggregates live leaderboard for a competition
   * Deterministic tie-breaking:
   * 1. totalScore (DESC)
   * 2. completedTasks (DESC)
   * 3. approvedSubmissions (DESC)
   * 4. earliestSubmission (ASC)
   * 5. teamName (ASC)
   *
   * @param {string|mongoose.Types.ObjectId} competitionId
   * @returns {Promise<Array>} Ranked leaderboard entries
   */
  async getCompetitionLeaderboard(competitionId) {
    const compObjectId = new mongoose.Types.ObjectId(competitionId.toString());

    // 1. Fetch all active teams in this competition with college info
    const teams = await Team.find({
      competitionId: compObjectId,
      status: { $ne: "DISQUALIFIED" }
    }).populate("collegeId", "collegeId name location");

    if (!teams || teams.length === 0) {
      return [];
    }

    // 2. Fetch all approved evaluations for submissions in this competition
    const submissions = await Submission.find({
      competitionId: compObjectId,
      status: { $in: [SUBMISSION_STATUS.EVALUATED, SUBMISSION_STATUS.SUBMITTED] }
    }).select("_id teamId taskId submittedAt");

    const submissionIds = submissions.map((s) => s._id);

    // Get approved evaluations
    const evaluations = await Evaluation.find({
      submissionId: { $in: submissionIds },
      decision: EVALUATION_DECISION.APPROVED
    });

    // Map submission to score and details
    const evalMap = new Map();
    evaluations.forEach((ev) => {
      // If multiple evaluations exist for same submission, use latest
      evalMap.set(ev.submissionId.toString(), ev.totalScore);
    });

    // Aggregate team metrics
    const teamStats = new Map();

    // Initialize all teams
    teams.forEach((t) => {
      teamStats.set(t._id.toString(), {
        teamId: t.teamId,
        teamDbId: t._id,
        teamName: t.teamName,
        collegeId: t.collegeId?.collegeId || "N/A",
        collegeName: t.collegeId?.name || "Unknown College",
        totalScore: 0,
        completedTasks: new Set(),
        approvedSubmissions: 0,
        earliestSubmission: null
      });
    });

    // Accumulate scores for approved submissions
    submissions.forEach((sub) => {
      const score = evalMap.get(sub._id.toString());
      if (score !== undefined) {
        const stats = teamStats.get(sub.teamId.toString());
        if (stats) {
          stats.totalScore += score;
          stats.completedTasks.add(sub.taskId.toString());
          stats.approvedSubmissions += 1;

          if (
            sub.submittedAt &&
            (!stats.earliestSubmission || sub.submittedAt < stats.earliestSubmission)
          ) {
            stats.earliestSubmission = sub.submittedAt;
          }
        }
      }
    });

    // Convert map to array
    const leaderboard = Array.from(teamStats.values()).map((entry) => ({
      teamId: entry.teamId,
      teamDbId: entry.teamDbId,
      teamName: entry.teamName,
      collegeId: entry.collegeId,
      collegeName: entry.collegeName,
      totalScore: Math.round(entry.totalScore * 100) / 100,
      completedTasks: entry.completedTasks.size,
      approvedSubmissions: entry.approvedSubmissions,
      earliestSubmission: entry.earliestSubmission
    }));

    // Deterministic sort
    leaderboard.sort((a, b) => {
      // 1. Total score DESC
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      // 2. Completed unique tasks DESC
      if (b.completedTasks !== a.completedTasks) {
        return b.completedTasks - a.completedTasks;
      }
      // 3. Approved submissions count DESC
      if (b.approvedSubmissions !== a.approvedSubmissions) {
        return b.approvedSubmissions - a.approvedSubmissions;
      }
      // 4. Earliest submission ASC (sooner submitter wins tie)
      if (a.earliestSubmission && b.earliestSubmission) {
        if (a.earliestSubmission.getTime() !== b.earliestSubmission.getTime()) {
          return a.earliestSubmission.getTime() - b.earliestSubmission.getTime();
        }
      } else if (a.earliestSubmission && !b.earliestSubmission) {
        return -1;
      } else if (!a.earliestSubmission && b.earliestSubmission) {
        return 1;
      }
      // 5. Alphabetical by team name ASC
      return a.teamName.localeCompare(b.teamName);
    });

    // Assign rank
    return leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item
    }));
  }
}

module.exports = new LeaderboardService();

const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Team = require("../models/Team");
const Task = require("../models/Task");
const College = require("../models/College");
const Evaluation = require("../models/Evaluation");
const { SUBMISSION_STATUS, EVALUATION_DECISION } = require("../utils/constants");

class ImpactService {
  /**
   * Fetch IDs of submissions that have APPROVED evaluations
   */
  async getApprovedSubmissionIds(competitionId) {
    const compObjectId = new mongoose.Types.ObjectId(competitionId.toString());

    const submissions = await Submission.find({
      competitionId: compObjectId,
      status: SUBMISSION_STATUS.EVALUATED
    }).select("_id");

    const candidateIds = submissions.map((s) => s._id);

    // Verify evaluation decision is APPROVED
    const approvedEvals = await Evaluation.find({
      submissionId: { $in: candidateIds },
      decision: EVALUATION_DECISION.APPROVED
    }).distinct("submissionId");

    return approvedEvals;
  }

  /**
   * Overall impact metrics for a competition
   */
  async getCompetitionImpact(competitionId) {
    const compObjectId = new mongoose.Types.ObjectId(competitionId.toString());

    const approvedSubIds = await this.getApprovedSubmissionIds(compObjectId);

    const approvedSubmissions = await Submission.find({
      _id: { $in: approvedSubIds }
    }).populate("teamId", "collegeId members");

    let totalWasteRecoveredKg = 0;
    let totalStudentHours = 0;
    let totalAwarenessCount = 0;
    let totalClimateActions = 0;

    const participatingTeamsSet = new Set();
    const participatingCollegesSet = new Set();
    const participatingStudentsSet = new Set();
    const completedTasksSet = new Set();

    approvedSubmissions.forEach((sub) => {
      if (sub.impactData) {
        totalWasteRecoveredKg += sub.impactData.wasteRecoveredKg || 0;
        totalStudentHours += sub.impactData.studentHours || 0;
        totalAwarenessCount += sub.impactData.awarenessCount || 0;
        totalClimateActions += sub.impactData.climateActionCount || 0;
      }

      completedTasksSet.add(sub.taskId.toString());

      if (sub.teamId) {
        participatingTeamsSet.add(sub.teamId._id.toString());
        if (sub.teamId.collegeId) {
          participatingCollegesSet.add(sub.teamId.collegeId.toString());
        }
        if (Array.isArray(sub.teamId.members)) {
          sub.teamId.members.forEach((m) => participatingStudentsSet.add(m.toString()));
        }
      }
    });

    return {
      totalWasteRecoveredKg: Math.round(totalWasteRecoveredKg * 100) / 100,
      totalStudentHours: Math.round(totalStudentHours * 10) / 10,
      totalAwarenessCount,
      totalClimateActions,
      approvedSubmissions: approvedSubmissions.length,
      completedTasksCount: completedTasksSet.size,
      participatingTeamsCount: participatingTeamsSet.size,
      participatingCollegesCount: participatingCollegesSet.size,
      participatingStudentsCount: participatingStudentsSet.size
    };
  }

  /**
   * Impact aggregated by college
   */
  async getImpactByCollege(competitionId) {
    const compObjectId = new mongoose.Types.ObjectId(competitionId.toString());
    const approvedSubIds = await this.getApprovedSubmissionIds(compObjectId);

    const approvedSubmissions = await Submission.find({
      _id: { $in: approvedSubIds }
    }).populate({
      path: "teamId",
      populate: { path: "collegeId", select: "collegeId name location" }
    });

    const collegeMap = new Map();

    approvedSubmissions.forEach((sub) => {
      const college = sub.teamId?.collegeId;
      if (!college) return;

      const collegeIdStr = college._id.toString();
      if (!collegeMap.has(collegeIdStr)) {
        collegeMap.set(collegeIdStr, {
          collegeId: college.collegeId,
          collegeName: college.name,
          location: college.location,
          totalWasteRecoveredKg: 0,
          totalStudentHours: 0,
          totalAwarenessCount: 0,
          totalClimateActions: 0,
          approvedSubmissions: 0,
          teams: new Set()
        });
      }

      const entry = collegeMap.get(collegeIdStr);
      entry.totalWasteRecoveredKg += sub.impactData?.wasteRecoveredKg || 0;
      entry.totalStudentHours += sub.impactData?.studentHours || 0;
      entry.totalAwarenessCount += sub.impactData?.awarenessCount || 0;
      entry.totalClimateActions += sub.impactData?.climateActionCount || 0;
      entry.approvedSubmissions += 1;
      if (sub.teamId?._id) entry.teams.add(sub.teamId._id.toString());
    });

    return Array.from(collegeMap.values()).map((c) => ({
      ...c,
      totalWasteRecoveredKg: Math.round(c.totalWasteRecoveredKg * 100) / 100,
      totalStudentHours: Math.round(c.totalStudentHours * 10) / 10,
      activeTeamsCount: c.teams.size,
      teams: undefined
    }));
  }

  /**
   * Impact aggregated by task
   */
  async getImpactByTask(competitionId) {
    const compObjectId = new mongoose.Types.ObjectId(competitionId.toString());
    const approvedSubIds = await this.getApprovedSubmissionIds(compObjectId);

    const tasks = await Task.find({ competitionId: compObjectId });
    const approvedSubmissions = await Submission.find({
      _id: { $in: approvedSubIds }
    });

    const taskMap = new Map();
    tasks.forEach((t) => {
      taskMap.set(t._id.toString(), {
        taskId: t._id,
        title: t.title,
        taskType: t.taskType,
        maxPoints: t.maxPoints,
        totalWasteRecoveredKg: 0,
        totalStudentHours: 0,
        totalAwarenessCount: 0,
        totalClimateActions: 0,
        approvedSubmissions: 0
      });
    });

    approvedSubmissions.forEach((sub) => {
      const entry = taskMap.get(sub.taskId.toString());
      if (entry) {
        entry.totalWasteRecoveredKg += sub.impactData?.wasteRecoveredKg || 0;
        entry.totalStudentHours += sub.impactData?.studentHours || 0;
        entry.totalAwarenessCount += sub.impactData?.awarenessCount || 0;
        entry.totalClimateActions += sub.impactData?.climateActionCount || 0;
        entry.approvedSubmissions += 1;
      }
    });

    return Array.from(taskMap.values()).map((t) => ({
      ...t,
      totalWasteRecoveredKg: Math.round(t.totalWasteRecoveredKg * 100) / 100,
      totalStudentHours: Math.round(t.totalStudentHours * 10) / 10
    }));
  }
}

module.exports = new ImpactService();

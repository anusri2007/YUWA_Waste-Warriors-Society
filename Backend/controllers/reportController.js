const Competition = require("../models/Competition");
const leaderboardService = require("../services/leaderboardService");
const impactService = require("../services/impactService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get detailed competition report (JSON)
// @route   GET /api/reports/:competitionId
// @access  Admin / Coordinator
const getReport = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const [leaderboard, impact, impactByCollege, impactByTask] = await Promise.all([
      leaderboardService.getCompetitionLeaderboard(competitionId),
      impactService.getCompetitionImpact(competitionId),
      impactService.getImpactByCollege(competitionId),
      impactService.getImpactByTask(competitionId)
    ]);

    return sendSuccess(res, `Comprehensive report for ${competition.name}`, {
      competition,
      summary: {
        totalRankedTeams: leaderboard.length,
        overallImpact: impact
      },
      leaderboard,
      collegeBreakdown: impactByCollege,
      taskBreakdown: impactByTask
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to generate report", 500);
  }
};

// @desc    Export competition report as CSV
// @route   GET /api/reports/:competitionId/export
// @access  Admin / Coordinator
const exportReport = async (req, res) => {
  try {
    const { competitionId } = req.params;

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return sendError(res, "Competition not found", 404);
    }

    const leaderboard = await leaderboardService.getCompetitionLeaderboard(competitionId);

    // Build CSV content
    const headers = [
      "Rank",
      "Team ID",
      "Team Name",
      "College ID",
      "College Name",
      "Total Score",
      "Completed Tasks",
      "Approved Submissions"
    ];

    const rows = leaderboard.map((item) => [
      item.rank,
      `"${item.teamId}"`,
      `"${item.teamName.replace(/"/g, '""')}"`,
      `"${item.collegeId}"`,
      `"${item.collegeName.replace(/"/g, '""')}"`,
      item.totalScore,
      item.completedTasks,
      item.approvedSubmissions
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Ecolympics_Report_${competition.year}.csv"`
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    return sendError(res, error.message || "Failed to export report", 500);
  }
};

module.exports = {
  getReport,
  exportReport
};

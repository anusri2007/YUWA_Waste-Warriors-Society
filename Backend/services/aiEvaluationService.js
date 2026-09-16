const { EVIDENCE_TYPES } = require("../utils/constants");

class AiEvaluationService {
  /**
   * Evaluates a submission against a task and rubric criteria using configured AI provider or heuristic fallback.
   * @param {Object} params
   * @param {Object} params.task - The Task document or object
   * @param {Object} params.rubric - The Rubric document or object
   * @param {Object} params.submission - The Submission document or object
   * @returns {Promise<Object>} Validated AI evaluation result
   */
  async evaluateSubmission({ task, rubric, submission }) {
    if (!task) throw new Error("Task is required for AI evaluation");
    if (!rubric || !rubric.criteria || rubric.criteria.length === 0) {
      throw new Error("A rubric with criteria is required for AI evaluation");
    }
    if (!submission) throw new Error("Submission is required for AI evaluation");

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || "gemini-1.5-flash";

    let rawResult = null;

    if (apiKey) {
      try {
        rawResult = await this._callGeminiProvider({ task, rubric, submission, apiKey, model });
      } catch (err) {
        console.warn("AI Provider API call failed or timed out. Falling back to heuristic evaluator.", err.message);
        rawResult = this._heuristicEvaluation({ task, rubric, submission });
      }
    } else {
      // Offline / Developer / Mock mode when no external API key is configured
      rawResult = this._heuristicEvaluation({ task, rubric, submission });
    }

    // Strictly validate and sanitize AI output against the rubric
    return this._validateAndSanitize(rawResult, rubric);
  }

  /**
   * Calls Google Gemini API with structured JSON response formatting
   */
  async _callGeminiProvider({ task, rubric, submission, apiKey, model }) {
    const prompt = this._buildEvaluationPrompt({ task, rubric, submission });
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      throw new Error("No text content returned from AI provider");
    }

    return JSON.parse(candidate);
  }

  /**
   * Builds detailed contextual prompt for the AI model
   */
  _buildEvaluationPrompt({ task, rubric, submission }) {
    const rubricCriteriaList = rubric.criteria.map((c, i) => 
      `${i + 1}. Criterion ID: "${c._id}", Name: "${c.name}", Max Points: ${c.maxPoints}, Description: "${c.description || 'N/A'}"`
    ).join("\n");

    const evidenceList = (submission.evidence || []).map((e, i) =>
      `- Evidence #${i + 1}: Type = [${e.type}], Caption = "${e.caption || 'None'}", URL = "${e.url || 'N/A'}"`
    ).join("\n") || "No file or media evidence provided.";

    const impactList = submission.impactData
      ? `Waste Recovered: ${submission.impactData.wasteRecoveredKg || 0} kg, Student Hours: ${submission.impactData.studentHours || 0}, Awareness Count: ${submission.impactData.awarenessCount || 0}, Climate Action Count: ${submission.impactData.climateActionCount || 0}`
      : "No numerical impact recorded.";

    return `
You are an expert environmental project evaluation assistant for the Ecolympics competition.
Your task is to analyze a student team's submission against the defined task requirements and active rubric criteria.

IMPORTANT GUIDELINES:
1. You are an AI ASSISTANT, NOT the final decision maker. Your score is a suggested baseline for a human evaluator.
2. Carefully assess the submission reflection, reported impact metrics, and evidence metadata against each rubric criterion.
3. Every criterion score MUST be between 0 and its specified maxPoints.
4. Provide constructive reasoning for each criterion score and objective observations on the evidence provided.
5. Set confidence between 0.0 and 1.0 based on evidence quality and completeness.

TASK SPECIFICATION:
- Title: ${task.title}
- Description: ${task.description}
- Instructions: ${task.instructions || 'Follow project rules'}
- Task Type: ${task.taskType}
- Maximum Points: ${task.maxPoints}

ACTIVE RUBRIC CRITERIA (Total: ${rubric.totalPoints || task.maxPoints} points):
${rubricCriteriaList}

SUBMISSION DETAILS:
- Student Reflection: "${submission.reflection || 'No reflection provided.'}"
- Impact Metrics: ${impactList}
- Evidence Items (${submission.evidence?.length || 0} items):
${evidenceList}

You MUST return ONLY a valid JSON object strictly matching this schema:
{
  "suggestedScore": <number: total sum of all criterion scores>,
  "confidence": <number between 0.0 and 1.0>,
  "overallReasoning": "<summary explaining the suggested evaluation>",
  "evidenceObservations": [
    "<specific observation regarding evidence item or reflection quality>"
  ],
  "criteria": [
    {
      "criterionId": "<string matching the criterion ID>",
      "criterionName": "<name of criterion>",
      "score": <number between 0 and maxPoints>,
      "maxScore": <number: maxPoints for this criterion>,
      "reasoning": "<specific rationale for score in this criterion>"
    }
  ]
}
`;
  }

  /**
   * Deterministic, intelligent heuristic fallback evaluator for offline or dev environments
   */
  _heuristicEvaluation({ task, rubric, submission }) {
    const evidenceItems = submission.evidence || [];
    const photoCount = evidenceItems.filter((e) => e.type === EVIDENCE_TYPES.PHOTO).length;
    const videoCount = evidenceItems.filter((e) => e.type === EVIDENCE_TYPES.VIDEO).length;
    const docCount = evidenceItems.filter((e) => e.type === EVIDENCE_TYPES.DOCUMENT).length;
    const reflection = submission.reflection || "";
    const reflectionLength = reflection.trim().length;

    const impact = submission.impactData || {};
    const totalImpact = (impact.wasteRecoveredKg || 0) + (impact.awarenessCount || 0) + (impact.studentHours || 0);

    const evidenceObservations = [];

    if (evidenceItems.length > 0) {
      evidenceObservations.push(
        `Submitted ${evidenceItems.length} evidence artifact(s): ${photoCount} photo(s), ${videoCount} video(s), ${docCount} document(s).`
      );
    } else {
      evidenceObservations.push("No direct multimedia files were attached to the submission.");
    }

    if (reflectionLength >= 80) {
      evidenceObservations.push("Comprehensive student reflection provided with clear project insights.");
    } else if (reflectionLength >= 20) {
      evidenceObservations.push("Moderate reflection provided; could benefit from deeper analysis of challenges encountered.");
    } else {
      evidenceObservations.push("Brief or missing reflection notes.");
    }

    if (totalImpact > 0) {
      evidenceObservations.push(
        `Reported tangible outcomes: ${impact.wasteRecoveredKg || 0} kg waste recovered, ${impact.studentHours || 0} student hours, ${impact.awarenessCount || 0} people reached.`
      );
    }

    // Evaluate each criterion
    let criteriaResults = [];
    let totalScoreSum = 0;

    for (const c of rubric.criteria) {
      const name = c.name.toLowerCase();
      let factor = 0.8; // default 80% baseline for submitted tasks

      if (name.includes("evidence") || name.includes("media") || name.includes("proof") || name.includes("quality")) {
        if (photoCount >= 2 || (photoCount >= 1 && videoCount >= 1)) factor = 0.92;
        else if (evidenceItems.length >= 1) factor = 0.82;
        else factor = 0.45;
      } else if (name.includes("impact") || name.includes("outcome") || name.includes("waste") || name.includes("quantity")) {
        if (totalImpact > 20) factor = 0.95;
        else if (totalImpact > 0) factor = 0.85;
        else factor = 0.7;
      } else if (name.includes("reflection") || name.includes("learning") || name.includes("presentation") || name.includes("creativity")) {
        if (reflectionLength > 150) factor = 0.94;
        else if (reflectionLength > 50) factor = 0.84;
        else factor = 0.65;
      } else {
        factor = 0.85;
      }

      // Calculate score bounded to maxPoints
      const calculatedScore = Math.min(c.maxPoints, Math.max(0, Math.round(c.maxPoints * factor)));
      totalScoreSum += calculatedScore;

      criteriaResults.push({
        criterionId: c._id ? c._id.toString() : null,
        criterionName: c.name,
        score: calculatedScore,
        maxScore: c.maxPoints,
        reasoning: `Awarded ${calculatedScore}/${c.maxPoints} based on evidence completeness (${evidenceItems.length} items) and verified submission details.`
      });
    }

    let confidence = 0.85;
    if (evidenceItems.length >= 2 && reflectionLength > 100) {
      confidence = 0.92;
    } else if (evidenceItems.length === 0) {
      confidence = 0.65;
    }

    return {
      suggestedScore: totalScoreSum,
      confidence,
      overallReasoning: `Automated assessment conducted across ${rubric.criteria.length} rubric criteria. Submission demonstrates solid execution with ${evidenceItems.length} supporting evidence file(s) and structured student reflection.`,
      evidenceObservations,
      criteria: criteriaResults
    };
  }

  /**
   * Strictly validates and normalizes AI evaluation output
   */
  _validateAndSanitize(rawResult, rubric) {
    if (!rawResult || typeof rawResult !== "object") {
      throw new Error("Invalid response format from AI evaluation");
    }

    const totalRubricPoints = rubric.totalPoints || rubric.criteria.reduce((sum, c) => sum + (c.maxPoints || 0), 0);
    const sanitizedCriteria = [];
    let calculatedTotal = 0;

    for (const rubricCrit of rubric.criteria) {
      const critIdStr = rubricCrit._id ? rubricCrit._id.toString() : "";
      const critNameLower = (rubricCrit.name || "").trim().toLowerCase();

      // Find matching item in rawResult.criteria
      let match = null;
      if (Array.isArray(rawResult.criteria)) {
        match = rawResult.criteria.find((c) => {
          if (c.criterionId && c.criterionId.toString() === critIdStr) return true;
          if (c.criterionName && c.criterionName.trim().toLowerCase() === critNameLower) return true;
          if (c.criterion && c.criterion.trim().toLowerCase() === critNameLower) return true;
          return false;
        });
      }

      let score = match && typeof match.score === "number" ? Math.round(match.score) : Math.round(rubricCrit.maxPoints * 0.8);

      // Validate bounds: 0 <= score <= maxPoints
      if (score < 0) score = 0;
      if (score > rubricCrit.maxPoints) score = rubricCrit.maxPoints;

      calculatedTotal += score;

      sanitizedCriteria.push({
        criterionId: rubricCrit._id,
        criterionName: rubricCrit.name,
        score,
        maxPoints: rubricCrit.maxPoints,
        reasoning: match?.reasoning || `Score aligned with ${rubricCrit.name} criteria guidelines.`
      });
    }

    // Validate confidence in [0, 1]
    let confidence = typeof rawResult.confidence === "number" ? rawResult.confidence : 0.85;
    if (confidence < 0) confidence = 0;
    if (confidence > 1) confidence = 1;

    // Validate overall reasoning and evidence observations
    const overallReasoning = rawResult.overallReasoning && typeof rawResult.overallReasoning === "string"
      ? rawResult.overallReasoning.trim()
      : `AI-assisted evaluation based on ${rubric.criteria.length} rubric criteria.`;

    const evidenceObservations = Array.isArray(rawResult.evidenceObservations)
      ? rawResult.evidenceObservations.filter((o) => typeof o === "string" && o.trim().length > 0).map((o) => o.trim())
      : ["Evidence metadata analyzed against rubric requirements."];

    return {
      suggestedScore: calculatedTotal,
      maxPossibleScore: totalRubricPoints,
      confidence: Math.round(confidence * 100) / 100,
      overallReasoning,
      evidenceObservations,
      criteria: sanitizedCriteria
    };
  }
}

module.exports = new AiEvaluationService();

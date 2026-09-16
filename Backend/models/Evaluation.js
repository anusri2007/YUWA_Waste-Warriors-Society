const mongoose = require("mongoose");
const { EVALUATION_DECISION, AI_REVIEW_STATUS } = require("../utils/constants");

const criteriaScoreSchema = new mongoose.Schema({
  criterionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  criterionName: {
    type: String,
    trim: true,
    default: ""
  },
  score: {
    type: Number,
    required: [true, "Criterion score is required"],
    min: [0, "Score cannot be negative"]
  },
  maxPoints: {
    type: Number,
    required: true
  }
});

const aiCriterionScoreSchema = new mongoose.Schema({
  criterionId: {
    type: mongoose.Schema.Types.ObjectId
  },
  criterionName: {
    type: String,
    trim: true,
    default: ""
  },
  score: {
    type: Number,
    min: 0,
    default: 0
  },
  maxPoints: {
    type: Number,
    default: 0
  },
  reasoning: {
    type: String,
    trim: true,
    default: ""
  }
});

const evaluationSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: [true, "Submission reference is required"]
    },
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Evaluator reference is required"]
    },
    rubricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rubric",
      required: [true, "Rubric reference is required"]
    },
    rubricVersion: {
      type: Number,
      default: 1
    },
    criteriaScores: [criteriaScoreSchema],
    totalScore: {
      type: Number,
      required: [true, "Total score is required"],
      min: 0,
      default: 0
    },
    maxPossibleScore: {
      type: Number,
      default: 100
    },
    feedback: {
      type: String,
      trim: true,
      default: ""
    },
    decision: {
      type: String,
      enum: Object.values(EVALUATION_DECISION),
      default: EVALUATION_DECISION.APPROVED
    },
    // AI Evaluation fields (preserves AI suggestions independently of human score)
    aiSuggestedScore: {
      type: Number,
      default: null
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null
    },
    aiReasoning: {
      type: String,
      trim: true,
      default: ""
    },
    aiEvidenceObservations: [
      {
        type: String,
        trim: true
      }
    ],
    aiCriteriaScores: [aiCriterionScoreSchema],
    aiEvaluatedAt: {
      type: Date,
      default: null
    },
    reviewStatus: {
      type: String,
      enum: Object.values(AI_REVIEW_STATUS),
      default: AI_REVIEW_STATUS.PENDING_REVIEW
    }
  },
  {
    timestamps: true
  }
);

evaluationSchema.index({ submissionId: 1 });
evaluationSchema.index({ evaluatorId: 1 });
evaluationSchema.index({ decision: 1 });
evaluationSchema.index({ reviewStatus: 1 });

module.exports = mongoose.model("Evaluation", evaluationSchema);


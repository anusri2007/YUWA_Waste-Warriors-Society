const mongoose = require("mongoose");
const {
  SUBMISSION_STATUS,
  EVIDENCE_TYPES,
  COMMUNITY_VISIBILITY
} = require("../utils/constants");

const evidenceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(EVIDENCE_TYPES),
    required: [true, "Evidence type is required"]
  },
  url: {
    type: String,
    required: [true, "Evidence URL is required"],
    trim: true
  },
  caption: {
    type: String,
    trim: true,
    default: ""
  },
  publicId: {
    type: String,
    default: null
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const submissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team reference is required"]
    },
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Competition reference is required"]
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task reference is required"]
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Submitting student reference is required"]
    },
    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.DRAFT
    },
    reflection: {
      type: String,
      trim: true,
      default: ""
    },
    impactData: {
      wasteRecoveredKg: { type: Number, default: 0, min: 0 },
      studentHours: { type: Number, default: 0, min: 0 },
      awarenessCount: { type: Number, default: 0, min: 0 },
      climateActionCount: { type: Number, default: 0, min: 0 }
    },
    evidence: [evidenceSchema],
    submittedAt: {
      type: Date,
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    visibility: {
      type: String,
      enum: Object.values(COMMUNITY_VISIBILITY),
      default: COMMUNITY_VISIBILITY.COLLEGE
    },
    celebrationCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

submissionSchema.index({ teamId: 1 });
submissionSchema.index({ taskId: 1 });
submissionSchema.index({ competitionId: 1 });
submissionSchema.index({ status: 1 });
// Compound index to help query team submission for specific task
submissionSchema.index({ teamId: 1, taskId: 1 });

module.exports = mongoose.model("Submission", submissionSchema);

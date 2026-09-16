const mongoose = require("mongoose");

const evaluationAssignmentSchema = new mongoose.Schema(
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
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["ASSIGNED", "IN_PROGRESS", "COMPLETED"],
      default: "ASSIGNED"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

evaluationAssignmentSchema.index({ submissionId: 1, evaluatorId: 1 }, { unique: true });
evaluationAssignmentSchema.index({ evaluatorId: 1, status: 1 });

module.exports = mongoose.model("EvaluationAssignment", evaluationAssignmentSchema);

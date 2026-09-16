const mongoose = require("mongoose");
const { CALIBRATION_STATUS } = require("../utils/constants");

const calibrationSchema = new mongoose.Schema(
  {
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true
    },
    referenceScore: {
      type: Number,
      required: true
    },
    evaluatorScore: {
      type: Number,
      required: true
    },
    difference: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(CALIBRATION_STATUS),
      default: CALIBRATION_STATUS.CALIBRATION_PASS
    },
    feedback: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

calibrationSchema.index({ evaluatorId: 1, taskId: 1 });

module.exports = mongoose.model("Calibration", calibrationSchema);

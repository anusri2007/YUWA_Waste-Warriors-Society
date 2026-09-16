const mongoose = require("mongoose");
const { TASK_TYPES, TASK_STATUS } = require("../utils/constants");

const taskSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Competition reference is required"]
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true
    },
    taskType: {
      type: String,
      enum: Object.values(TASK_TYPES),
      default: TASK_TYPES.CLEANUP
    },
    instructions: {
      type: String,
      trim: true,
      default: ""
    },
    deadline: {
      type: Date,
      required: [true, "Task deadline is required"]
    },
    maxPoints: {
      type: Number,
      required: [true, "Maximum points is required"],
      min: [1, "Max points must be greater than 0"],
      default: 100
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.ACTIVE
    },
    requiredEvidence: {
      photo: { type: Boolean, default: false },
      video: { type: Boolean, default: false },
      reflection: { type: Boolean, default: false },
      wasteWeightKg: { type: Boolean, default: false }
    },
    impactMetrics: {
      wasteRecoveredKg: { type: Boolean, default: false },
      studentHours: { type: Boolean, default: false },
      awarenessCount: { type: Boolean, default: false },
      climateActionCount: { type: Boolean, default: false }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ competitionId: 1 });
taskSchema.index({ status: 1 });

module.exports = mongoose.model("Task", taskSchema);

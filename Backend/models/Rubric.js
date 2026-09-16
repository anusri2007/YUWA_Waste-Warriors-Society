const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Criterion name is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  maxPoints: {
    type: Number,
    required: [true, "Criterion max points is required"],
    min: [1, "Max points must be at least 1"]
  }
});

const rubricSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task reference is required"]
    },
    criteria: [criterionSchema],
    totalPoints: {
      type: Number,
      required: true,
      default: 0
    },
    version: {
      type: Number,
      default: 1
    },
    active: {
      type: Boolean,
      default: true
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

rubricSchema.index({ taskId: 1, active: 1 });
rubricSchema.index({ taskId: 1, version: 1 });

module.exports = mongoose.model("Rubric", rubricSchema);

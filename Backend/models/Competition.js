const mongoose = require("mongoose");
const { COMPETITION_STATUS } = require("../utils/constants");

const competitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Competition name is required"],
      trim: true
    },
    year: {
      type: Number,
      required: [true, "Competition year is required"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"]
    },
    status: {
      type: String,
      enum: Object.values(COMPETITION_STATUS),
      default: COMPETITION_STATUS.DRAFT
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

competitionSchema.index({ status: 1 });
competitionSchema.index({ year: 1 });

module.exports = mongoose.model("Competition", competitionSchema);

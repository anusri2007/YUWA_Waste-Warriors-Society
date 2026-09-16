const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true
    },
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Competition reference is required"]
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College reference is required"]
    },
    coordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Coordinator reference is required"]
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "DISQUALIFIED", "WITHDRAWN"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

teamSchema.index({ competitionId: 1 });
teamSchema.index({ collegeId: 1 });
teamSchema.index({ members: 1 });
teamSchema.index({ coordinatorId: 1 });

module.exports = mongoose.model("Team", teamSchema);

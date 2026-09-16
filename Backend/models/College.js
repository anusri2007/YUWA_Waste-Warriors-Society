const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    collegeId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, "College name is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "College location is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

collegeSchema.index({ name: 1 });

module.exports = mongoose.model("College", collegeSchema);

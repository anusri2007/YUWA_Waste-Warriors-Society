const mongoose = require("mongoose");
const { ROLES, USER_STATUS } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ role: 1 });
userSchema.index({ collegeId: 1 });

module.exports = mongoose.model("User", userSchema);
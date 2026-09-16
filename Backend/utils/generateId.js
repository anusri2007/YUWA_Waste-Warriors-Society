const Counter = require("../models/Counter");

/**
 * Concurrency-safe atomic ID generator using Counter collection
 * e.g., generateId("college", "COL") -> "COL-001"
 * e.g., generateId("team", "TEAM") -> "TEAM-001"
 */
const generateId = async (sequenceName, prefix, padLength = 3) => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(padLength, "0");
  return `${prefix}-${paddedSeq}`;
};

module.exports = generateId;

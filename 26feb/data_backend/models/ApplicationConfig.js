const mongoose = require("mongoose");
/**
 * CONFIG SCHEMA - MongoDB Collection: "configs"
 *
 * This collection stores the MASTER configuration for each application type.
 * The master admin decides which documents are required/visible for each
 * application type (APPLY_PASSPORT, APPLY_DRIVING_LICENCE, APPLY_NOC).
 *
 * Structure:
 * {
 *   applicationType: "APPLY_PASSPORT",     // unique key per application type
 *   documents: {
 *     aadhar_card: { display: true },      // master toggled ON  → user sees upload field
 *     pan_card:    { display: false },     // master toggled OFF → user does NOT see field
 *     tenth_memo:  { display: true },
 *     twelth_memo: { display: false }
 *   }
 * }
 */
const documentFieldSchema = new mongoose.Schema(
  {
    display: { type: Boolean, default: false },
  },
  { _id: false }
);

const configSchema = new mongoose.Schema(
  {
    applicationType: {
      type: String,
      required: true,
      unique: true, // One config document per application type
      // enum: ["APPLY_PASSPORT", "APPLY_DRIVING_LICENCE", "APPLY_NOC"],
    },
    documents: {
      aadhar_card: { type: documentFieldSchema, default: { display: false } },
      pan_card:    { type: documentFieldSchema, default: { display: false } },
      tenth_memo:  { type: documentFieldSchema, default: { display: false } },
      twelth_memo: { type: documentFieldSchema, default: { display: false } },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
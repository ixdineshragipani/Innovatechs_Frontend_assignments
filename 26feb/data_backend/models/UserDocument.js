const mongoose = require("mongoose");

/**
 * DOCUMENT SCHEMA - MongoDB Collection: "userdocuments"
 *
 * This collection stores the documents uploaded by users.
 * Each submission is tied to an application type and a user name.
 * Only documents that the master has enabled (display: true) will be uploaded.
 *
 * Structure:
 * {
 *   userName: "John Doe",
 *   applicationType: "APPLY_PASSPORT",
 *   files: {
 *     aadhar_card: "uploads/aadhar_card-1234567890.pdf",   // file path on server
 *     pan_card:    null,                                    // not required / not uploaded
 *     tenth_memo:  "uploads/tenth_memo-9876543210.jpg",
 *     twelth_memo: null
 *   },
 *   submittedAt: "2024-01-15T10:30:00Z"
 * }
 */
const fileFieldSchema = new mongoose.Schema(
  {
    filePath: { type: String, default: null },   // server-side file path
    fileName: { type: String, default: null },   // original file name shown to user
  },
  { _id: false }
);

const userDocumentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    applicationType: {
      type: String,
      required: true,
      enum: ["APPLY_PASSPORT", "APPLY_DRIVING_LICENCE", "APPLY_NOC"],
    },
    files: {
      aadhar_card: { type: fileFieldSchema, default: null },
      pan_card:    { type: fileFieldSchema, default: null },
      tenth_memo:  { type: fileFieldSchema, default: null },
      twelth_memo: { type: fileFieldSchema, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDocument", userDocumentSchema);



// const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema(
//   {
//     filePath: { type: String, default: null }, // path: "uploads/aadhar_card-123.pdf"
//     fileName: { type: String, default: null }, // original name which have user uploaded
//   },
//   { _id: false } // dont create separate id for sub-documents
// );

// const UserSchema=new mongoose.Schema({
//     userId:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     ApplicationKey:{
//         type: String,
//         required: true,
//         enum: ["APPLY_PASSPORT", "APPLY_DRIVING_LICENCE", "APPLY_NOC"],
//     },
//     documents:{
//         aadhar_card:{type:fileSchema, default:null},
//         pan_card: {type:fileSchema, default:null},
//         tenth_memo: {type:fileSchema, default:null},
//         twelth_memo: {type:fileSchema, default:null},
//     }
// },{timestamps:true});

// module.exports=mongoose.model("UserDocument",UserSchema);
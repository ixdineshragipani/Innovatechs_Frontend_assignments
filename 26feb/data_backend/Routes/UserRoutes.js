const express = require("express");
const router = express.Router();
const upload = require("../middlaware/upload");
const UserDocument = require("../models/UserDocument");
const Config = require("../models/ApplicationConfig");

const DOCUMENT_FIELDS = ["aadhar_card", "pan_card", "tenth_memo", "twelth_memo"];

router.post(
  "/upload",
  upload.fields(DOCUMENT_FIELDS.map((field) => ({ name: field, maxCount: 1 }))),
  async (req, res) => {
    try {
      const { userName, applicationType } = req.body;

      if (!userName || !applicationType) {
        return res.status(400).json({ success: false, message: "userName and applicationType are required" });
      }

      // Fetch the master config to validate that only enabled fields are accepted
      const config = await Config.findOne({ applicationType });
      if (!config) {
        return res.status(404).json({ success: false, message: "Config not found for this application type" });
      }

      // Build the files object - only include fields master has enabled
      const files = {};
      for (const field of DOCUMENT_FIELDS) {
        const isEnabled = config.documents[field]?.display;
        const uploadedFile = req.files?.[field]?.[0];

        if (isEnabled && uploadedFile) {
          files[field] = {
            filePath: `uploads/${uploadedFile.filename}`,
            fileName: uploadedFile.originalname,
          };
        } else {
          files[field] = null;
        }
      }

      // Save to MongoDB
      const docRecord = await UserDocument.create({
        userName,
        applicationType,
        files,
      });

      res.status(201).json({
        success: true,
        message: "Documents uploaded successfully!",
        data: docRecord,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/**
 * GET /api/documents
 * Returns all user document submissions (for admin review, optional).
 */
router.get("/", async (req, res) => {
  try {
    const docs = await UserDocument.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const UserDocument = require("../models/UserDocument");
// const Config = require("../models/Config");

// const DOCUMENT_FIELDS = ["aadhar_card", "pan_card", "tenth_memo", "twelth_memo"];

// /**
//  * POST /api/documents/upload
//  * User uploads documents. Multer handles multiple file fields.
//  *
//  * Form data:
//  *   - userName (string)
//  *   - applicationType (string)
//  *   - aadhar_card (file, optional)
//  *   - pan_card (file, optional)
//  *   - tenth_memo (file, optional)
//  *   - twelth_memo (file, optional)
//  */
// router.post(
//   "/upload",
//   upload.fields(DOCUMENT_FIELDS.map((field) => ({ name: field, maxCount: 1 }))),
//   async (req, res) => {
//     try {
//       const { userName, applicationType } = req.body;

//       if (!userName || !applicationType) {
//         return res.status(400).json({ success: false, message: "userName and applicationType are required" });
//       }

//       // Fetch the master config to validate that only enabled fields are accepted
//       const config = await Config.findOne({ applicationType });
//       if (!config) {
//         return res.status(404).json({ success: false, message: "Config not found for this application type" });
//       }

//       // Build the files object - only include fields master has enabled
//       const files = {};
//       for (const field of DOCUMENT_FIELDS) {
//         const isEnabled = config.documents[field]?.display;
//         const uploadedFile = req.files?.[field]?.[0];

//         if (isEnabled && uploadedFile) {
//           files[field] = {
//             filePath: `uploads/${uploadedFile.filename}`,
//             fileName: uploadedFile.originalname,
//           };
//         } else {
//           files[field] = null;
//         }
//       }

//       // Save to MongoDB
//       const docRecord = await UserDocument.create({
//         userName,
//         applicationType,
//         files,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Documents uploaded successfully!",
//         data: docRecord,
//       });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// );

// /**
//  * GET /api/documents
//  * Returns all user document submissions (for admin review, optional).
//  */
// router.get("/", async (req, res) => {
//   try {
//     const docs = await UserDocument.find({}).sort({ createdAt: -1 });
//     res.json({ success: true, data: docs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;
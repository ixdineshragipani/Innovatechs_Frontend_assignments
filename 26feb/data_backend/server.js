const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const dotenv = require("dotenv");
const path = require("path");

// dotenv.config();

// git testing

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Test route — visit http://localhost:5000/ping to confirm server works
app.get('/ping', (req, res) => {
  res.json({ message: 'Backend is alive ' });
});

// MongoDB
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB error:", err));

// Routes
const configRoutes   = require("./Routes/AdminRoutes");
const documentRoutes = require("./Routes/UserRoutes");

app.use("/api/config",   configRoutes);
app.use("/api/documents", documentRoutes);

// Catch-all — shows what route was actually hit if 404
app.use((req, res) => {
  console.log(`404 — ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});













// const express  = require("express");
// const mongoose = require("mongoose");
// const cors     = require("cors");
// const dotenv   = require("dotenv");
// const path     = require("path");

// dotenv.config();

// const app = express();

// app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(" MongoDB error:", err));

// // ── Models ───────────────────────────────────────────────────
// const Config       = require("./models/Config");
// const UserDocument = require("./models/UserDocument");

// // ════════════════════════════════════════════════════════════
// // CONFIG ROUTES — all defined directly here, no separate file
// // ════════════════════════════════════════════════════════════

// const DEFAULT_TYPES = ["APPLY_PASSPORT", "APPLY_DRIVING_LICENCE", "APPLY_NOC"];

// const ensureDefaults = async () => {
//   for (const type of DEFAULT_TYPES) {
//     await Config.findOneAndUpdate(
//       { applicationType: type },
//       {
//         $setOnInsert: {
//           applicationType: type,
//           documents: {
//             aadhar_card: { display: false },
//             pan_card:    { display: false },
//             tenth_memo:  { display: false },
//             twelth_memo: { display: false },
//           },
//         },
//       },
//       { upsert: true, new: true }
//     );
//   }
// };

// // GET /api/config
// app.get("/api/config", async (req, res) => {
//   console.log("HIT: GET /api/config");
//   try {
//     await ensureDefaults();
//     const configs = await Config.find({}).sort({ createdAt: 1 });
//     console.log("Total configs:", configs.length);
//     res.json({ success: true, data: configs });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // GET /api/config/types/all
// app.get("/api/config/types/all", async (req, res) => {
//   console.log("HIT: GET /api/config/types/all");
//   try {
//     await ensureDefaults();
//     const configs = await Config.find({}, { applicationType: 1 }).sort({ createdAt: 1 });
//     const types   = configs.map(c => c.applicationType);
//     console.log("Types:", types);
//     res.json({ success: true, data: types });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // POST /api/config/create  ← MUST be before GET /api/config/:applicationType
// app.post("/api/config/create", async (req, res) => {
//   console.log("HIT: POST /api/config/create", req.body);
//   try {
//     const { applicationType } = req.body;

//     if (!applicationType || applicationType.trim() === "") {
//       return res.status(400).json({ success: false, message: "applicationType is required" });
//     }

//     const formatted = applicationType.trim().toUpperCase().replace(/\s+/g, "_");
//     const finalName = formatted.startsWith("APPLY_") ? formatted : `APPLY_${formatted}`;

//     const existing = await Config.findOne({ applicationType: finalName });
//     if (existing) {
//       return res.status(409).json({ success: false, message: `"${finalName}" already exists` });
//     }

//     const newConfig = await Config.create({
//       applicationType: finalName,
//       documents: {
//         aadhar_card: { display: false },
//         pan_card:    { display: false },
//         tenth_memo:  { display: false },
//         twelth_memo: { display: false },
//       },
//     });

//     console.log(" Created:", finalName);
//     res.status(201).json({
//       success: true,
//       message: `"${finalName}" created successfully`,
//       data: newConfig,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // GET /api/config/:applicationType  ← MUST be after /create and /types/all
// app.get("/api/config/:applicationType", async (req, res) => {
//   console.log("HIT: GET /api/config/" + req.params.applicationType);
//   try {
//     const { applicationType } = req.params;
//     let config = await Config.findOne({ applicationType });
//     if (!config) {
//       config = await Config.create({
//         applicationType,
//         documents: {
//           aadhar_card: { display: false },
//           pan_card:    { display: false },
//           tenth_memo:  { display: false },
//           twelth_memo: { display: false },
//         },
//       });
//     }
//     res.json({ success: true, data: config });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // PUT /api/config/:applicationType
// app.put("/api/config/:applicationType", async (req, res) => {
//   console.log("HIT: PUT /api/config/" + req.params.applicationType);
//   try {
//     const { applicationType } = req.params;
//     const { documents }       = req.body;

//     if (!documents) {
//       return res.status(400).json({ success: false, message: "documents field is required" });
//     }

//     const updated = await Config.findOneAndUpdate(
//       { applicationType },
//       { $set: { documents } },
//       { new: true, upsert: true }
//     );

//     console.log("Updated:", applicationType);
//     res.json({ success: true, message: "Config updated successfully", data: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // DELETE /api/config/:applicationType
// app.delete("/api/config/:applicationType", async (req, res) => {
//   console.log("HIT: DELETE /api/config/" + req.params.applicationType);
//   try {
//     const { applicationType } = req.params;
//     const deleted = await Config.findOneAndDelete({ applicationType });

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: `"${applicationType}" not found` });
//     }

//     console.log("Deleted:", applicationType);
//     res.json({ success: true, message: `"${applicationType}" deleted successfully` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ════════════════════════════════════════════════════════════
// // DOCUMENT ROUTES
// // ════════════════════════════════════════════════════════════

// const multer = require("multer");
// const fs     = require("fs");

// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename:    (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// const DOCUMENT_FIELDS = ["aadhar_card", "pan_card", "tenth_memo", "twelth_memo"];

// // POST /api/documents/upload
// app.post(
//   "/api/documents/upload",
//   upload.fields(DOCUMENT_FIELDS.map(f => ({ name: f, maxCount: 1 }))),
//   async (req, res) => {
//     console.log("\n=== UPLOAD REQUEST ===");
//     console.log("Body:",  req.body);
//     console.log("Files:", req.files ? Object.keys(req.files) : "none");
//     try {
//       const { userName, applicationType } = req.body;

//       if (!userName)        return res.status(400).json({ success: false, message: "userName is required" });
//       if (!applicationType) return res.status(400).json({ success: false, message: "applicationType is required" });

//       let config = await Config.findOne({ applicationType });
//       if (!config) {
//         config = await Config.create({ applicationType });
//       }

//       const files = {};
//       for (const field of DOCUMENT_FIELDS) {
//         const isEnabled    = config.documents?.[field]?.display === true;
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

//       const docRecord = await UserDocument.create({ userName: userName.trim(), applicationType, files });
//       console.log("Saved:", docRecord._id);
//       res.status(201).json({ success: true, message: "Documents uploaded successfully!", data: docRecord });
//     } catch (err) {
//       console.error(" Upload error:", err.message);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// );

// // GET /api/documents
// app.get("/api/documents", async (req, res) => {
//   try {
//     const docs = await UserDocument.find({}).sort({ createdAt: -1 });
//     res.json({ success: true, data: docs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ════════════════════════════════════════════════════════════
// // CATCH ALL 404
// // ════════════════════════════════════════════════════════════
// app.use((req, res) => {
//   console.log(` Route not found: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server on http://localhost:${PORT}`);
// });
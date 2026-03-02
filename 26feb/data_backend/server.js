const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const dotenv = require("dotenv");
const path = require("path");

// dotenv.config();

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
const configRoutes   = require("./routes/AdminRoutes");
const documentRoutes = require("./routes/UserRoutes");

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


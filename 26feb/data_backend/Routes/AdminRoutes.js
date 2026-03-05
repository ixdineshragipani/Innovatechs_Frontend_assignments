const express = require("express");
const router  = express.Router();
const Config  = require("../models/ApplicationConfig");

const APPLICATION_TYPES = ["APPLY_PASSPORT", "APPLY_DRIVING_LICENCE", "APPLY_NOC"];

router.get("/", async (req, res) => {
  console.log("HIT: GET /api/config");
  try {
    for (const type of APPLICATION_TYPES) {
      await Config.findOneAndUpdate(
        { applicationType: type },
        { $setOnInsert: { applicationType: type } },
        { upsert: true, new: true }
      );
    }
    const configs = await Config.find({});
    res.json({ success: true, data: configs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:applicationType", async (req, res) => {
  console.log(" HIT: GET /api/config/" + req.params.applicationType);
  try {
    const { applicationType } = req.params;

    if (!APPLICATION_TYPES.includes(applicationType)) {
      return res.status(400).json({ success: false, message: "Invalid application type: " + applicationType });
    }

    let config = await Config.findOne({ applicationType });
    if (!config) {
      config = await Config.create({ applicationType });
    }

    res.json({ success: true, data: config });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:applicationType", async (req, res) => {
  console.log(" HIT: PUT /api/config/" + req.params.applicationType);
  console.log("Body received:", JSON.stringify(req.body));
  try {
    const { applicationType } = req.params;
    const { documents } = req.body;

    if (!APPLICATION_TYPES.includes(applicationType)) {
      return res.status(400).json({ success: false, message: "Invalid application type: " + applicationType });
    }

    if (!documents) {
      return res.status(400).json({ success: false, message: "documents field is required in body" });
    }

    const updated = await Config.findOneAndUpdate(
      { applicationType },
      { $set: { documents } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: "Config updated", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
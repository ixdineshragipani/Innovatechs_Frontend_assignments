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

router.post("/create",async(req,res)=>{
  console.log("HIT: POST /api/config/create");
  console.log("Body: ",req.body);
  try{
    const {applicationType}=req.body;
    if(!applicationType || applicationType.trim()===""){
      return res.status(400).json({success:false,message:"applicationType required"});
    }
    // Format: uppercase + replace spaces with underscore
    const formatted=applicationType.trim().toUpperCase().replace(/\s+/g, "_");
    const existing=await Config.findOne({applicationType:formatted});  // Check if already exists
    if(existing){
      return res.status(409).json({success: false, message: `${formatted} already exists`});
    }
    const newConfig=await Config.create({
      applicationType:formatted,
      documents:{
        aadhar_card:{display:false},
        pan_Card:{display:false},
        tenth_memo:{display:false},
        twelth_memo:{display:false}
      }
    });
    res.status(201).json({
      success:type,
      message:`${formatted} created successfully`,
      data:newConfig
    });
  }catch(e){
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
})


//put new config
router.put(":/applicationType",async(req,res)=>{
  console.log("HIT: /PUT/api/config"+req.params.applicationType)
  try{
    const { applicationType }=req.params;
    const {documents}=req.body;

    if(!documents){
      return res.status(400).json({success:false,message:"documents field required"});
    }
    const updated=await Config.findOneAndUpdate(
      {applicationType},
      {$set:{documents}},
      {new:true,upsert:true}
    );
    res.json({success:true, message:"config updated",date:updated});
  }
  catch(e){
    console.error(e);
    res.status(500).json({success:false,message:e.message});
  }
});


//delete application type
router.delete(":/applicationType",async(req,res)=>{
  console.log("HIT: DELETE /api/config"+req.params.applicationType);
  try{
    const { applicationType }=req.params;
    if(APPLICATION_TYPES.includes(applicationType)){
      return res.status(403).json({
        success:false,
        message:`cannot delete the field ${applicationType}`
      });
    }
    const deleted = await Config.findOneAndDelete({applicationType});
    if(!deleted){
      return res.status(400).json({success:false,message:"Type not found in APPLICATION_TYPES"})
    }
    res.json({success:false,message:`${appliationType} deleted Successfully`});
  }
  catch(e){
    console.error(e);
    return res.status(500).json({success:false,message:e.message})
  }
})

module.exports = router;
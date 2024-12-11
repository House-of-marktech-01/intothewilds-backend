const express = require('express');
const { getProperties, getPropertyById,editProperty, addProperty, deleteProperty} = require('../controller/propertiesController');
const router = express.Router();

router.get("/getProperties", getProperties);
router.get("/getPropertyById/:id", getPropertyById);
router.put("/updateProperty/:id",editProperty);
router.post("/addProperty", addProperty);
router.delete("/deleteProperty/:id", deleteProperty);

module.exports = router;
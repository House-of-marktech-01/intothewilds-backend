const express = require('express');
const { getProperties, getPropertyById,editProperty} = require('../controller/propertiesController');
const router = express.Router();

router.get("/getProperties", getProperties);
router.get("/getPropertyById/:id", getPropertyById);
router.put("/updateProperty/:id",editProperty);

module.exports = router;
const express = require('express');
const { getProperties, getPropertyById} = require('../controller/propertiesController');

const router = express.Router();

router.get("/getProperties", getProperties);
router.get("/getPropertyById/:id", getPropertyById);

module.exports = router;
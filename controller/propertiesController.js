const Properties = require("../models/Properties");

const getProperties = async (req, res) => {
    try {
        const properties = await Properties.find();
        res.status(200).json({message: "Properties fetched successfully", properties: properties});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPropertyById = async (req, res) => {
    const { id } = req.params;
    try {
        const property = await Properties.findById(id);
        res.status(200).json({message: "Property fetched successfully", property: property});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProperties,
    getPropertyById
};

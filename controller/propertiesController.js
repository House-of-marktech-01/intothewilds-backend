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

const editProperty = async (req, res) => {
    const { id } = req.params;
    const { name, price,guestCapacity ,maximumCapacity} = req.body;
    const property = await Properties.findByIdAndUpdate(id, { name, price,guestCapacity ,maximumCapacity});
    res.status(200).json({ message: "Property updated successfully", property: property });
};

module.exports = {
    getProperties,
    getPropertyById,
    editProperty
};

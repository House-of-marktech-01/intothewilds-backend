

const Inventory = require('../models/Inventory');

exports.createRoom = async (req, res) => {
    try {
        const { roomType, roomNumber, description, amenities, ratePerNight, maxOccupancy, images } = req.body;

        // Check if room number already exists
        const existingRoom = await Inventory.findOne({ roomNumber });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room number already exists.' });
        }

        // Create a new room
        const newRoom = new Inventory({
            roomType,
            roomNumber,
            description,
            amenities,
            ratePerNight,
            maxOccupancy,
            images,
            availabilityStatus: true,  
        });

        await newRoom.save();

        return res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create room', error: error.message });
    }
};

// Get all rooms in the inventory
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Inventory.find();

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found in the inventory.' });
        }

        return res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }
};

// Get room details by room number
exports.getRoomByNumber = async (req, res) => {
    try {
        const { roomNumber } = req.params;

        const room = await Inventory.findOne({ roomNumber });

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch room', error: error.message });
    }
};

// Update room details
exports.updateRoom = async (req, res) => {
    try {
        const { roomNumber } = req.params;
        const { roomType, description, amenities, ratePerNight, maxOccupancy, images, availabilityStatus, lastMaintenanceDate } = req.body;

        const room = await Inventory.findOne({ roomNumber });
        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        // Update the room details
        room.roomType = roomType || room.roomType;
        room.description = description || room.description;
        room.amenities = amenities || room.amenities;
        room.ratePerNight = ratePerNight || room.ratePerNight;
        room.maxOccupancy = maxOccupancy || room.maxOccupancy;
        room.images = images || room.images;
        room.availabilityStatus = availabilityStatus !== undefined ? availabilityStatus : room.availabilityStatus;
        room.lastMaintenanceDate = lastMaintenanceDate || room.lastMaintenanceDate;

        await room.save();

        return res.status(200).json({ message: 'Room details updated successfully', room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update room', error: error.message });
    }
};

// Delete a room from the inventory
exports.deleteRoom = async (req, res) => {
    try {
        const { roomNumber } = req.params;

        const room = await Inventory.findOneAndDelete({ roomNumber });

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        return res.status(200).json({ message: 'Room deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete room', error: error.message });
    }
};

// Update room availability (for example, after a booking is made or canceled)
exports.updateRoomAvailability = async (req, res) => {
    try {
        const { roomNumber } = req.params;
        const { availabilityStatus } = req.body;

        const room = await Inventory.findOne({ roomNumber });

        if (!room) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        room.availabilityStatus = availabilityStatus;
        room.isBooked = !availabilityStatus; // If room is not available, mark it as booked

        await room.save();

        return res.status(200).json({ message: 'Room availability updated successfully', room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update room availability', error: error.message });
    }
};

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to create a new room
router.post('/create', inventoryController.createRoom);

// Route to get all rooms in the inventory
router.get('/', inventoryController.getAllRooms);

// Route to get room details by room number
router.get('/:roomNumber', inventoryController.getRoomByNumber);

// Route to update room details by room number
router.put('/:roomNumber', inventoryController.updateRoom);

// Route to delete a room by room number
router.delete('/:roomNumber', inventoryController.deleteRoom);

// Route to update room availability by room number
router.put('/:roomNumber/availability', inventoryController.updateRoomAvailability);

module.exports = router;

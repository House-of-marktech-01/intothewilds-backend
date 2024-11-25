const Room = require("../models/Room");


// Create a room
exports.createRoom = async (req, res) => {
    try{
        const { type, capacity, price, availability } = req.body;
        const newRoom = new Room({ type, capacity, price, availability });
        await newRoom.save();
        res.status(201).json({ message: 'Room added successfully!', room: newRoom });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

//get-inventory
exports.getInventory = async (req, res) => {
    try {
      const inventory = await Room.find();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update inventory
exports.updateRoom = async (req, res) => {
    try {
      const { roomId } = req.params;
      const updates = req.body;
  
      const room = await Room.findByIdAndUpdate(roomId, updates, { new: true });
      if (!room) return res.status(404).json({ error: 'Room not found.' });
  
      res.status(200).json({ message: 'Room updated successfully!', room });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Remove room
exports.removeRoom = async (req, res) => {
    try {
      const { roomId } = req.params;
  
      const room = await Room.findByIdAndDelete(roomId);
      if (!room) return res.status(404).json({ error: 'Room not found.' });
  
      res.status(200).json({ message: 'Room removed successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
const express = require("express");
const inventoryController = require("../controller/inverntoryController");
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');


const router = express.Router();
router.post("/create-room", authenticateToken, authorizeRole('admin'), inventoryController.createRoom);
router.get("/get-inventory", inventoryController.getInventory);
router.put("/update-room/:roomId", authenticateToken,authorizeRole('admin'), inventoryController.updateRoom);
router.delete("/remove-room/:roomId",  authenticateToken,authorizeRole('admin'),inventoryController.removeRoom);
module.exports = router;
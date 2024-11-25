const express = require("express");
const inventoryController = require("../controllers/inventoryController");

const router = express.Router();
router.post("/create-room", inventoryController.createRoom);
router.get("/get-inventory", inventoryController.getInventory);
router.put("/update-room/:roomId", inventoryController.updateRoom);
router.delete("/remove-room/:roomId", inventoryController.removeRoom);
module.exports = router;
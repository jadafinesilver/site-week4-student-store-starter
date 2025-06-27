const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderItemController");

// fetch all orderItems 
router.get("/", controller.getAll);
//fetch the entire order it belongs to 
//router.get("/orders/:order_id", controller.getAssociated); -> handled in order 
// create a new orderItem
router.post("/", controller.create);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

router.get("/", controller.getAll);
router.get("/:order_id", controller.getById);
router.get("/:order_id/total", controller.totalPrice); // milestone 5 part 2
router.post("/", controller.create);
router.post("/:order_id/items", controller.addItem) // milestone 5 part 1
router.put("/:order_id", controller.update);
router.delete("/:order_id", controller.remove);

module.exports = router;
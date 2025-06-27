const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController'); 

router.get("/", controller.getAll);
router.get("/:product_id", controller.getById);
router.post("/", controller.create);
router.put("/:product_id", controller.update)
router.delete("/:product_id", controller.remove)

module.exports = router;
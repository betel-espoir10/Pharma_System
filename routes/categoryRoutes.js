const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

router.get("/addCategory", categoryController.categoryAddForm);
router.get("/listCategory", categoryController.categoryList);
router.post("/addCategory", categoryController.categoryPost);

module.exports = router;

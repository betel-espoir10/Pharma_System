const express = require("express");
const router = express.Router();

const manufacturerController = require("../controllers/manufacturerController");

router.get("/addManu", manufacturerController.manufacturerAddForm);
router.get("/listManu", manufacturerController.manufacturerList);
router.post("/addManu", manufacturerController.manufacturerPost);

module.exports = router;

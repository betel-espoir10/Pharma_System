const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");


// DASHBOARD

router.get("/index", dashboardController.dashboard);

module.exports = router;
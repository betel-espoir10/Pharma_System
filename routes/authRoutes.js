const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// LOGIN PAGE
router.get("/login",authController.showLogin);

// LOGIN PROCESS
router.post("/login", authController.login);

// LOGOUT
router.get("/logout", authController.logout);

module.exports = router;
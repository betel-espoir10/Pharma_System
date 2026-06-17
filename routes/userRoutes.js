const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// LIST
router.get("/listUser", userController.getAllUser);

// CREATE
// router.get("/addDrug", isAuthenticated, drugController.createForm);
// FORM
router.get("/addUser", userController.showAddForm);
// STORE
router.post("/addUser", userController.createUser);
// FORM EDIT
router.get("/editUser/:id", userController.showEditForm);

// UPDATE
router.post("/editUser/:id", userController.updateUser);

// DELETE
router.post("/delete/:id", userController.deleteUser);

module.exports = router;

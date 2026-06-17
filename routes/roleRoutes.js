const express = require("express");
const router = express.Router();

const roleController = require("../controllers/roleController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// LIST
router.get("/listRole", roleController.getAllRole);

// CREATE
// router.get("/addDrug", isAuthenticated, drugController.createForm);
// FORM
router.get("/addRole", roleController.showAddForm);
// STORE
router.post("/addRole", roleController.createRole);
// FORM EDIT
router.get("/edit/:id", roleController.showEditForm);

// UPDATE
router.post("/edit/:id", roleController.updateRole);

// DELETE
router.post("/delete/:id", roleController.deleteRole);

module.exports = router;

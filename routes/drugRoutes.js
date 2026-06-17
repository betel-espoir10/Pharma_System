const express = require("express");
const router = express.Router();

const drugController = require("../controllers/drugController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// LIST
router.get("/listDrug", drugController.getAllDrug);

// CREATE
// router.get("/addDrug", isAuthenticated, drugController.createForm);
// FORM
router.get("/addDrug", drugController.showAddForm);
// STORE
router.post("/addDrug", drugController.store);
// FORM EDIT
router.get("/edit/:id", drugController.showEditForm);

// UPDATE
router.post("/edit/:id", drugController.update);

// DELETE
router.post("/delete/:id", drugController.delete);

module.exports = router;

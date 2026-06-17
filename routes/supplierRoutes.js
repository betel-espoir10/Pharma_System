const express = require("express");
const router = express.Router();

const supplierController = require("../controllers/supplierController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// LIST
router.get("/listSupplier", supplierController.getAllSupplier);

// CREATE
// router.get("/addDrug", isAuthenticated, drugController.createForm);
// FORM
router.get("/addSupplier", supplierController.showAddForm);
// STORE
router.post("/addSupplier", supplierController.createSupplier);
// FORM EDIT
router.get("/edit/:id", supplierController.showEditForm);

// UPDATE
router.post("/edit/:id", supplierController.updateSupplier);

// DELETE
router.post("/delete/:id", supplierController.deleteSupplier);

module.exports = router;

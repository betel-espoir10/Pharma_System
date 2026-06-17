const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// LIST
router.get("/listCustomer", customerController.getAllCustomer);

// CREATE
// router.get("/addDrug", isAuthenticated, drugController.createForm);
// FORM
router.get("/addCustomer", customerController.showAddForm);
// STORE
router.post("/addCustomer", customerController.store);
// FORM EDIT
router.get("/edit/:id", customerController.showEditForm);

// UPDATE
router.post("/edit/:id", customerController.updateCustomer);

// DELETE
router.post("/delete/:id", customerController.deleteCustomer);

module.exports = router;

const express = require("express");
const router = express.Router();

// CONTROLLER
const purchaseController = require("../controllers/purchaseController");

// AJOUTER ACHAT (FORM)
router.get("/addPurchase", purchaseController.showAddForm);

// ENREGISTRER ACHAT
router.post("/addPurchase", purchaseController.storePurchase);

// LISTE DES ACHATS
router.get("/listPurchase", purchaseController.getAllPurchases);

// DETAILS ACHAT
router.get("/show/:id", purchaseController.showPurchaseDetails);

// FORMULAIRE MODIFICATION
router.get("/editPurchase/:id",purchaseController.showEditForm);

// UPDATE ACHAT
router.post("/editPurchase/:id", purchaseController.updatePurchase);

// ANNULATION ACHAT
router.get("/cancel/:id",purchaseController.cancelPurchase);

// EXPORT
module.exports = router;
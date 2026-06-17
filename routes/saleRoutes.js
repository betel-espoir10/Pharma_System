const express = require("express");
const router = express.Router();

const saleController = require("../controllers/saleController");
const invoiceController = require("../controllers/invoiceController");

// FORM AJOUT
router.get( "/addSale",saleController.showAddForm);

// STORE
router.post( "/addSale",saleController.storeSale);

// LISTE
router.get("/listSale", saleController.getAllSales);

// EDIT FORM
router.get("/editSale/:id",saleController.showEditForm);

// UPDATE
router.post("/editSale/:id",saleController.updateSale);

// AFFICHER FACTURE
router.get("/showSale/:id", saleController.showSale );

// IMPRESSION
router.get( "/invoice/:id", invoiceController.generateInvoice);

module.exports = router;
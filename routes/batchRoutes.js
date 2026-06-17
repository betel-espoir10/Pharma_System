const express = require("express");
const router = express.Router();

const batchController = require("../controllers/batchController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// LIST
router.get("/listBatch", batchController.getAllBatch);
// FORM
router.get("/addBatch", batchController.showAddForm);
// STORE
router.post("/addBatch", batchController.createBatch);
// FORM EDIT
router.get("/edit/:id", batchController.showEditForm);
// UPDATE
router.post("/edit/:id", batchController.updateBatch);
// DELETE
router.post("/delete/:id", batchController.deleteBatch);

module.exports = router;

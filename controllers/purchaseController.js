const { Purchase, PurchaseItem, Supplier, Drug, Batch, User, StockMovement} = require("../models");

const sequelize = require("../config/db");
const crypto = require("crypto");

// ============================================
// AFFICHER FORMULAIRE AJOUT ACHAT
// ============================================
exports.showAddForm = async (req, res) => {

  try {

    const suppliers = await Supplier.findAll({
      order: [["name", "ASC"]]
    });

    const drugs = await Drug.findAll({
      order: [["name", "ASC"]]
    });
    res.render("purchases/addPurchase", {
      suppliers,
      drugs
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

// ============================================
// ENREGISTRER ACHAT COMPLET
// ============================================
exports.storePurchase = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {
    const {
      supplierId,
      paymentMethod,
      paidAmount,
      notes,
      drugId,
      quantity,
      purchasePrice,
      sellingPrice,
      expirationDate
    } = req.body;

// ============================================
// CALCULS
// ============================================

    const subtotal = quantity * purchasePrice;
    const totalAmount = subtotal;
    const balance = totalAmount - paidAmount;

// ============================================
// NUMERO FACTURE
// ============================================

    const invoiceNumber = "PUR-" + Date.now();

// ============================================
// CREATION ACHAT
// ============================================

 const purchase = await Purchase.create({

        invoiceNumber,
        supplierId,
        userId: req.user?.id || 1,
        totalAmount,
        paidAmount,
        balance,
        paymentMethod,
        paymentStatus:
          balance > 0
            ? "PARTIAL"
            : "PAID",
        purchaseStatus:
          "COMPLETED",
        notes
      }, {
        transaction
      });

// ============================================
// GENERATION NUMERO LOT
// ============================================

    const batchNumber =
      "BATCH-" +
      crypto.randomBytes(4)
      .toString("hex");

// ============================================
// CREATION PURCHASE ITEM
// ============================================

    const purchaseItem = await PurchaseItem.create({

        purchaseId: purchase.id,
        drugId,
        quantity,
        purchasePrice,
        sellingPrice,
        subtotal,
        expirationDate,
        batchNumber
      }, {
        transaction
      });


    // ============================================
    // CREATION LOT AUTOMATIQUE
    // ============================================

    const batch = await Batch.create({
        batchNumber,
        quantity,
        remainingStock: quantity,
        alertThreshold: 10,
        purchasePrice,
        sellingPrice,
        expirationDate,
        drugId
      }, {
        transaction
      });

    // ============================================
    // STOCK MOVEMENT AUTOMATIQUE
    // ============================================

    await StockMovement.create({

      movementType: "ENTRY",
      quantity,
      previousStock: 0,
      newStock: quantity,
      reason: "Nouvel achat fournisseur",
      reference: invoiceNumber,
      batchId: batch.id,
      drugId,
      userId: req.user?.id || 1
    }, {
      transaction
    });

    // ============================================
    // VALIDATION TRANSACTION
    // ============================================

    await transaction.commit();

    // ============================================
    // REDIRECTION
    // ============================================

    res.redirect("/purchases/listPurchase");

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).render("errors/500");
  }
};


// ============================================
// LISTE DES ACHATS
// ============================================
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
        include: [
          Supplier,
          User
        ],
        order: [
          ["createdAt", "DESC"]
        ]
      });

    res.render( "purchases/listPurchase", { purchases } );
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

// ============================================
// AFFICHER FORMULAIRE EDITION
// ============================================
exports.showEditForm = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk( req.params.id  );
    res.render( "purchases/editPurchase", { purchase }  );
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

// ============================================
// MISE A JOUR ACHAT
// ============================================
exports.updatePurchase = async (req, res) => {
  try {  
    const {  paymentMethod, paymentStatus, notes } = req.body;

    await Purchase.update({
      paymentMethod,
      paymentStatus,
      notes
    }, {
      where: {
        id: req.params.id
      }
    });

    res.redirect(  "/purchases/listPurchase" );
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};


// ============================================
// DETAILS ACHAT
// ============================================
exports.showPurchaseDetails = async (req, res) => {

  try {
  const purchase = await Purchase.findByPk(req.params.id, {
          include: [
            Supplier,
            User,
            {
              model: PurchaseItem,
              include: [Drug]
            }
          ]
        }
      );

    res.render( "purchases/showPurchase", { purchase });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

// ============================================
// ANNULATION ACHAT
// ============================================
exports.cancelPurchase = async (req, res) => {

  const transaction = await sequelize.transaction();
  try {
    const purchase =
      await Purchase.findByPk(
        req.params.id,
        {
          include: [PurchaseItem],
          transaction
        }
      );

    if (!purchase) {
      await transaction.rollback();
      return res.send(
        "Achat introuvable"
      );
    }

// ============================================
// ANNULER ITEMS
// ============================================
    for (const item of purchase.purchase_items) {
      const batch =
        await Batch.findOne({
          where: {
            batchNumber:
            item.batchNumber
          },
          transaction
        });

      if (batch) {
        batch.remainingStock = 0;
        await batch.save({
          transaction
        });

        // STOCK MOVEMENT
        await StockMovement.create({
          movementType:
          "ADJUSTMENT",
          quantity:
          item.quantity,
          previousStock:
          item.quantity,
          newStock: 0,
          reason:
          "Annulation achat",
          batchId:
           batch.id,
          drugId:
          item.drugId,
          userId:
          req.user?.id || 1
        }, {
          transaction
        });
      }
    }


// ============================================
// STATUT ACHAT
// ============================================
    purchase.purchaseStatus =
      "CANCELLED";
    await purchase.save({
      transaction
    });

    await transaction.commit();

    res.redirect( "/purchases/listPurchase" );
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).render("errors/500");
  }
};
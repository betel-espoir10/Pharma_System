const {Sale, SaleItem, Drug, Batch, Customer, User, StockMovement} = require("../models");
const sequelize = require("../config/db");
const { Op } = require("sequelize");


// AFFICHER FORMULAIRE AJOUT
exports.showAddForm = async (req, res) => {

  try {
    const customers = await Customer.findAll({
      order: [["name", "ASC"]]
    });
    const drugs = await Drug.findAll({
      order: [["name", "ASC"]]
    });
    const batches = await Batch.findAll({
      where: {
        remainingStock: {
          [Op.gt]: 0
        }
      },
      order: [["expirationDate", "ASC"]]
    });
    res.render("sales/addSale", {
      customers,
      drugs,
      batches
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};


// ENREGISTRER VENTE + FIFO
exports.storeSale = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {customerId, paymentMethod, paidAmount, notes, drugId, quantity} = req.body;

// RECHERCHE LOT FIFO
    const batches = await Batch.findAll({
      where: {
        drugId,
        remainingStock: {
          [Op.gt]: 0
        }
      },
  order: [["expirationDate", "ASC"]],
      transaction
    });

    if (!batches.length) {
      await transaction.rollback();
      return res.send("Aucun lot disponible.");
    }
    let remainingQty = parseInt(quantity);
    let totalAmount = 0;
    const saleItems = [];

// ====================================
// STATUT PAIEMENT AUTOMATIQUE
// ====================================
let paymentStatus = "PENDING";
if (
   paymentMethod === "CASH" ||
   paymentMethod === "MOBILE MONEY" ||
   paymentMethod === "CARD"
) {
   paymentStatus = "PAID";
}


// CREER FACTURE
    const invoiceNumber = "INV-" + Date.now();
    const sale = await Sale.create({
      invoiceNumber,
      customerId,
      userId: req.session.user.id,
      totalAmount: 0,
      paidAmount,
      balance: 0,
      paymentMethod,
      paymentStatus,
      saleStatus: "COMPLETED",
      notes
       }, {
      transaction
    });

// FIFO AUTOMATIQUE  
    for (const batch of batches) {
      if (remainingQty <= 0) break;
      const availableStock =
        batch.remainingStock;
      const qtyToTake = Math.min(
        remainingQty,
        availableStock
      );
 const previousStock = batch.remainingStock;

// MAJ STOCK
      batch.remainingStock -= qtyToTake;
      await batch.save({ transaction });

// SOUS TOTAL
      const subtotal = qtyToTake * batch.sellingPrice;
      totalAmount += subtotal;

// SALE ITEM
      const item = await SaleItem.create({
        saleId: sale.id,
        drugId,
        batchId: batch.id,
        quantity: qtyToTake,
        unitPrice: batch.sellingPrice,
        subtotal
      }, {
        transaction
      });
      saleItems.push(item);

// STOCK MOVEMENT
      await StockMovement.create({
        movementType: "SALE",
        quantity: qtyToTake,
        previousStock,
        newStock: batch.remainingStock,
        reason: "Vente médicament",
        batchId: batch.id,
        drugId,
        userId: req.user?.id || 1
      }, {
        transaction
      });
        remainingQty -= qtyToTake;
    }

// STOCK INSUFFISANT
    if (remainingQty > 0) {
      await transaction.rollback();
      return res.send(
        "Stock insuffisant pour terminer la vente."
      );
    }

// FINALISER FACTURE
    sale.totalAmount = totalAmount;

// CONVERTIR paidAmount EN NOMBRE
      const paid = parseFloat(paidAmount) || 0;
      sale.balance = totalAmount - paid;

      // STATUT AUTOMATIQUE
      if (sale.balance <= 0) {
        sale.paymentStatus = "PAID";
      } else if (paid > 0) {
        sale.paymentStatus = "PARTIAL";
      } else {
        sale.paymentStatus = "PENDING";
      }
          await sale.save({ transaction });
          await transaction.commit();
          res.redirect("/sales/listSale");
        } catch (error) {  await transaction.rollback();
          console.error(error);
          res.status(500).render("errors/500");
        }
      };

// SHOW SALE / FACTURE
exports.showSale = async (req, res) => {

   try {
      const sale = await Sale.findByPk( req.params.id, {
            include: [
               { model: Customer},
               { model: User},
               { model: SaleItem,
                  include: [
                     { model: Drug}
                  ]
               }
            ]
         }
      );

      if (!sale) {
         return res.status(404).send("Facture introuvable");
      }
      res.render("sales/showSale",{sale});
    } catch (error) {
      console.log(error);
      res.status(500).send( "Erreur serveur");
   }
};

// LISTE VENTES
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        Customer,
        User
      ],
      order: [["createdAt", "DESC"]]
    });
    res.render("sales/listSale", {
      sales
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

// EDIT FORM
exports.showEditForm = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    res.render("sales/editSale", {
      sale
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

// UPDATE VENTE
exports.updateSale = async (req, res) => {
  try {
    const {paymentMethod, paymentStatus, notes } = req.body;

    await Sale.update({
      paymentMethod,
      paymentStatus,
      notes
    }, {
      where: {
        id: req.params.id
      }
    });
    res.redirect("/sales/listSale");
     } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

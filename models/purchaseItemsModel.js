const Sequelize = require("sequelize");
const db = require("../config/db");

const PurchaseItem = db.define("purchase_item", {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  // // ACHAT
  // purchaseId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // // MEDICAMENT
  // drugId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // QUANTITE
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  // PRIX ACHAT
  purchasePrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

  // PRIX VENTE
  sellingPrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

  // SOUS TOTAL
  subtotal: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

  // DATE EXPIRATION
  expirationDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },

  // NUMERO LOT
  batchNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },

}, {
  timestamps: true,
});

module.exports = PurchaseItem;
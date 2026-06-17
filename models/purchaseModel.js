const Sequelize = require("sequelize");
const db = require("../config/db");
const crypto = require("crypto");

const Purchase = db.define("purchase", {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  // NUMERO FACTURE
  invoiceNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  // // FOURNISSEUR
  // supplierId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // // UTILISATEUR
  // userId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // DATE ACHAT
  purchaseDate: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },

  // MONTANT TOTAL
  totalAmount: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  // REDUCTION
  discount: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  // TAXE
  tax: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  // MONTANT PAYE
  paidAmount: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  // RESTE A PAYER
  balance: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  // MODE PAIEMENT
  paymentMethod: {
    type: Sequelize.ENUM(
      "CASH",
      "BANK",
      "MOBILE_MONEY"
    ),
    allowNull: false,
    defaultValue: "CASH",
  },

  // STATUT PAIEMENT
  paymentStatus: {
    type: Sequelize.ENUM(
      "PAID",
      "PENDING",
      "PARTIAL"
    ),
    allowNull: false,
    defaultValue: "PAID",
  },

  // STATUT ACHAT
  purchaseStatus: {
    type: Sequelize.ENUM(
      "COMPLETED",
      "CANCELLED"
    ),
    allowNull: false,
    defaultValue: "COMPLETED",
  },

  // NOTES
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  // TOKEN UNIQUE
  token: {
    type: Sequelize.STRING,
    unique: true,
  },
}, {
  timestamps: true,
});


// GENERER TOKEN
Purchase.beforeCreate((purchase) => {
  purchase.token = crypto.randomBytes(16).toString("hex");
});

module.exports = Purchase;
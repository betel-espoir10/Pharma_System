const Sequelize = require("sequelize");
const db = require("../config/db");
const crypto = require("crypto");

const Sale = db.define("sale", {
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

  // // CLIENT
  // customerId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // // UTILISATEUR / CAISSIER
  // userId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },
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
  // METHODE PAIEMENT
  paymentMethod: {
    type: Sequelize.ENUM(
      "CASH",
      "MOBILE_MONEY",
      "CARD",
      "BANK"
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

  // STATUT VENTE
  saleStatus: {
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

// TOKEN AUTO
Sale.beforeCreate((sale) => {
  sale.token = crypto.randomBytes(16).toString("hex");
});

module.exports = Sale;
const Sequelize = require("sequelize");
const db = require("../config/db");

const SaleItem = db.define("sale_item", {

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // // FACTURE
  // saleId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // // MEDICAMENT
  // drugId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // // LOT (IMPORTANT POUR FIFO)
  // batchId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },

  // QUANTITE
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  // PRIX UNITAIRE
  unitPrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

  // REDUCTION
  discount: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },

  // SOUS TOTAL
  subtotal: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = SaleItem;
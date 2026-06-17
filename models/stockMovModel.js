const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const crypto = require('crypto');

const StockMovement = sequelize.define("stock_movement", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
   // TYPE DE MOUVEMENT
  movementType: {
    type: Sequelize.ENUM(
      "ENTRY",
      "SALE",
      "LOSS",
      "ADJUSTMENT",
      "EXPIRED"
    ),
    allowNull: false,
  },
   // QUANTITE
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  // STOCK AVANT
  previousStock: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  // STOCK APRES
  newStock: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
    // RAISON
  reason: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // REFERENCE EXTERNE
  reference: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  token: {
    type: Sequelize.STRING,
    unique: true,
  },
},{
   timestamps: true
});

StockMovement.beforeCreate((stockMov) => {
  stockMov.token = crypto.randomBytes(16).toString('hex');
})

module.exports = StockMovement;

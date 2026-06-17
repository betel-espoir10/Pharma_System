const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const crypto = require('crypto');

const Batch = sequelize.define("batch", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  batchNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  remainingStock: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  alertThreshold: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  purchasePrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  sellingPrice: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  expirationDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    unique: true,
  },
});

Batch.beforeCreate((batch) => {
  batch.token = crypto.randomBytes(16).toString('hex');
})

module.exports = Batch;

const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

const Drug = sequelize.define("drug", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  dosage: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  form: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    unique: true,
  },
});

Drug.beforeCreate((drug) => {
  drug.token = crypto.randomBytes(16).toString("hex");
});

module.exports = Drug;

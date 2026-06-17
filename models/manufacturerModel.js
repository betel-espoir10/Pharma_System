const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

const Manufacturer = sequelize.define("manufacturer", {
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
  token: {
    type: Sequelize.STRING,
    unique: true,
  },
});

Manufacturer.beforeCreate((manu) => {
  manu.token = crypto.randomBytes(16).toString("hex");
});

module.exports = Manufacturer;

const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

const Role = sequelize.define("role", {
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

Role.beforeCreate((role) => {
  role.token = crypto.randomBytes(16).toString('hex');
});

module.exports = Role;

const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

const Category = sequelize.define("category", {
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

Category.beforeCreate((category) => {
  category.token = crypto.randomBytes(16).toString("hex");
});

module.exports = Category;

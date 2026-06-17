const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_pharma", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;

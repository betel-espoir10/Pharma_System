const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const crypto = require('crypto');

const Customer = sequelize.define('customer', {
  id:{
    type:Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name:{
    type: Sequelize.STRING,
    allowNull:false,
  },
  phone:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  address:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  token:{
    type: Sequelize.STRING,
    unique: true,
  }
})

Customer.beforeCreate((customer) => {
  customer.token = crypto.randomBytes(16).toString('hex');
});

module.exports = Customer;
const sequelize = require("../config/db");

// IMPORT MODELS
const User = require("./userModel");
const Role = require("./roleModel");
const Drug = require("./drugModel");
const Category = require("./categoryModel");
const Manufacturer = require("./manufacturerModel");
const Batch = require("./batchModel");
const StockMovement = require("./stockMovModel");
const Supplier = require("./supplierModel");
const Purchase = require("./purchaseModel");
const PurchaseItem = require("./purchaseItemsModel");
const Sale = require("./saleModel");
const SaleItem = require("./saleItemsModel");
const Customer = require("./customerModel");
const Prescription = require("./prescriptionModel");
// const PrescriptionItem = require("./PrescriptionItem");
const Payment = require("./paymentModel");

// ==========================
// USERS & ROLES
// ==========================
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

// ==========================
// DRUGS
// ==========================
Category.hasMany(Drug, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
Drug.belongsTo(Category, { foreignKey: "categoryId" });

Manufacturer.hasMany(Drug, {
  foreignKey: "manufacturerId",
  onDelete: "CASCADE",
});
Drug.belongsTo(Manufacturer, { foreignKey: "manufacturerId" });

// ==========================
// STOCK
// ==========================
Drug.hasMany(Batch, { foreignKey: "drugId" });
Batch.belongsTo(Drug, { foreignKey: "drugId" });

Batch.hasMany(StockMovement, { foreignKey: "batchId" });
StockMovement.belongsTo(Batch, { foreignKey: "batchId" });

User.hasMany(StockMovement, { foreignKey: "userId" });
StockMovement.belongsTo(User, { foreignKey: "userId" });

Drug.hasMany(StockMovement, { foreignKey: "drugId"});
StockMovement.belongsTo(Drug, { foreignKey: "drugId"});

// ==========================
// PURCHASES
// ==========================
Supplier.hasMany(Purchase, { foreignKey: "supplierId" });
Purchase.belongsTo(Supplier, { foreignKey: "supplierId" });

User.hasMany(Purchase, { foreignKey: "userId" });
Purchase.belongsTo(User, { foreignKey: "userId" });

Purchase.hasMany(PurchaseItem, { foreignKey: "purchaseId", onDelete: "CASCADE" });
PurchaseItem.belongsTo(Purchase, { foreignKey: "purchaseId" });

Drug.hasMany(PurchaseItem, { foreignKey: "drugId" });
PurchaseItem.belongsTo(Drug, { foreignKey: "drugId" });

// ==========================
// SALES
// ==========================
User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });

Customer.hasMany(Sale, { foreignKey: "customerId" });
Sale.belongsTo(Customer, { foreignKey: "customerId" });

Sale.hasMany(SaleItem, { foreignKey: "saleId",onDelete: "CASCADE" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });

Drug.hasMany(SaleItem, { foreignKey: "drugId" });
SaleItem.belongsTo(Drug, { foreignKey: "drugId" });

Batch.hasMany(SaleItem, { foreignKey: "batchId" });
SaleItem.belongsTo(Batch, { foreignKey: "batchId" });

// ==========================
// CUSTOMERS & PRESCRIPTIONS
// ==========================
// Customer.hasMany(Prescription, { foreignKey: "customerId" });
// Prescription.belongsTo(Customer, { foreignKey: "customerId" });

// Prescription.hasMany(PrescriptionItem, { foreignKey: "prescriptionId" });
// PrescriptionItem.belongsTo(Prescription, { foreignKey: "prescriptionId" });

// Drug.hasMany(PrescriptionItem, { foreignKey: "drugId" });
// PrescriptionItem.belongsTo(Drug, { foreignKey: "drugId" });

// ==========================
// PAYMENTS
// ==========================
// Sale.hasMany(Payment, { foreignKey: "saleId" });
// Payment.belongsTo(Sale, { foreignKey: "saleId" });

// ==========================
//  MANY-TO-MANY (OPTIONNEL)
// ==========================

// Roles ↔ Permissions (si implémenté)
// const Permission = require("./Permission");
// const RolePermission = require("./RolePermission");

// Role.belongsToMany(Permission, {
//   through: RolePermission,
//   foreignKey: "roleId",
// });

// Permission.belongsToMany(Role, {
//   through: RolePermission,
//   foreignKey: "permissionId",
// });

// ==========================
// EXPORT
// ==========================
module.exports = {
  sequelize,
  User,
  Role,
  Drug,
  Category,
  Manufacturer,
  Batch,
  StockMovement,
  Supplier,
  Purchase,
  PurchaseItem,
  Sale,
  SaleItem,
  Customer,
  // Prescription,
  // PrescriptionItem,
  // Payment,
  // Permission,
  // RolePermission,
};

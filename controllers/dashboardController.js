const { Drug, Sale, Purchase, Batch, Customer, Supplier, User } = require("../models");
const { Op } = require("sequelize");

const toNumber = (value) => Number(value) || 0;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function buildDailyActivity(days = 7) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));
    return date;
  });

  const activity = await Promise.all(dates.map(async (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const period = { createdAt: { [Op.gte]: date, [Op.lt]: nextDay } };
    const [sales, purchases] = await Promise.all([
      Sale.sum("totalAmount", { where: { ...period, saleStatus: "COMPLETED" } }),
      Purchase.sum("totalAmount", { where: { ...period, purchaseStatus: "COMPLETED" } })
    ]);

    return {
      label: new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(date),
      sales: toNumber(sales),
      purchases: toNumber(purchases)
    };
  }));

  return {
    labels: activity.map((day) => day.label),
    salesData: activity.map((day) => day.sales),
    purchaseData: activity.map((day) => day.purchases)
  };
}

exports.dashboard = async (req, res) => {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const next30Days = new Date(now);
    next30Days.setDate(next30Days.getDate() + 30);

    const completedSales = { saleStatus: "COMPLETED" };
    const completedPurchases = { purchaseStatus: "COMPLETED" };

    const [
      totalDrugs, totalCustomers, totalSuppliers, totalUsers, totalStock,
      totalSalesValue, totalPurchasesValue, todaySalesValue, monthlyPurchasesValue,
      lowStockBatches, expiredBatches, expiringSoon, recentSales, recentPurchases, activity
    ] = await Promise.all([
      Drug.count(),
      Customer.count(),
      Supplier.count(),
      User.count(),
      Batch.sum("remainingStock"),
      Sale.sum("totalAmount", { where: completedSales }),
      Purchase.sum("totalAmount", { where: completedPurchases }),
      Sale.sum("totalAmount", { where: { ...completedSales, createdAt: { [Op.gte]: today } } }),
      Purchase.sum("totalAmount", { where: { ...completedPurchases, createdAt: { [Op.gte]: startOfMonth } } }),
      Batch.findAll({ where: { remainingStock: { [Op.lte]: 10 } }, include: [Drug] }),
      Batch.findAll({ where: { expirationDate: { [Op.lt]: now } }, include: [Drug] }),
      Batch.findAll({ where: { expirationDate: { [Op.between]: [now, next30Days] } }, include: [Drug] }),
      Sale.findAll({ where: completedSales, limit: 5, order: [["createdAt", "DESC"]] }),
      Purchase.findAll({ where: completedPurchases, limit: 5, order: [["createdAt", "DESC"]] }),
      buildDailyActivity()
    ]);

    const totalRevenue = toNumber(totalSalesValue);
    const totalPurchases = toNumber(totalPurchasesValue);

    res.render("dashboard/index", {
      totalRevenue,
      totalSales: totalRevenue,
      totalPurchases,
      profit: totalRevenue - totalPurchases,
      totalDrugs,
      totalStock: toNumber(totalStock),
      totalCustomers,
      totalSuppliers,
      totalUsers,
      todaySales: toNumber(todaySalesValue),
      monthlyPurchases: toNumber(monthlyPurchasesValue),
      salesLabels: activity.labels,
      salesData: activity.salesData,
      purchaseData: activity.purchaseData,
      lowStockBatches,
      expiredBatches,
      expiringSoon,
      recentSales,
      recentPurchases,
      user: req.session.user
    });
  } catch (error) {
    console.error("Erreur dashboard:", error);
    res.status(500).render("errors/500");
  }
};

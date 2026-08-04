const { Drug, Sale, Purchase, Batch, Customer, Supplier, User} = require("../models");
const { Op } = require("sequelize");


// DASHBOARD ANALYTIQUE SaaS

exports.dashboard = async (req, res) => {
  try {

// DATE DU JOUR
    const today = new Date();

    const startOfDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

// PREMIER JOUR DU MOIS
    const startOfMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

// TOTAL MEDICAMENTS
    const totalDrugs = await Drug.count();

// TOTAL CLIENTS
    const totalCustomers = await Customer.count();

// TOTAL FOURNISSEURS
    const totalSuppliers = await Supplier.count();

// TOTAL USERS
    const totalUsers = await User.count();

// TOTAL STOCK
    const totalStock = await Batch.sum("remainingStock") || 0;

// TOTAL VENTES
    const totalSales = await Sale.sum("totalAmount") || 0;

 // TOTAL ACHATS
    const totalPurchases = await Purchase.sum("totalAmount") || 0;

// BENEFICE
    const profit =  totalSales - totalPurchases;

// VENTES DU JOUR
    const todaySales = await Sale.sum("totalAmount", {
        where: {
          createdAt: {
            [Op.gte]: startOfDay
          }
        }
      }) || 0;


// ACHATS DU MOIS
    const monthlyPurchases = await Purchase.sum("totalAmount", {
        where: {
          createdAt: {
            [Op.gte]: startOfMonth
          }
        }
      }) || 0;

// STOCK FAIBLE
    const lowStockBatches = await Batch.findAll({
        where: {
          remainingStock: {
            [Op.lte]: 10
          }
        },
        include: [Drug]
      });

 // PRODUITS EXPIRES
    const expiredBatches = await Batch.findAll({
        where: {
          expirationDate: {
            [Op.lt]: new Date()
          }
        },
        include: [Drug]
      });


// PRODUITS EXPIRANT BIENTOT
    const next30Days = new Date();

    next30Days.setDate(
      next30Days.getDate() + 30
    );

    const expiringSoon = await Batch.findAll({

        where: {
          expirationDate: {
            [Op.between]: [
              new Date(),
              next30Days
            ]
          }
        },
        include: [Drug]
      });

// DERNIERES VENTES
    const recentSales = await Sale.findAll({
        limit: 5,
        order: [
          ["createdAt", "DESC"]
        ]
      });

// DERNIERS ACHATS
    const recentPurchases = await Purchase.findAll({
        limit: 5,
        order: [
          ["createdAt", "DESC"]
        ]
      });

// VENTES DES 7 DERNIERS JOURS

const salesLabels = [];
const salesData = [];

for(let i = 6; i >= 0; i--){

    const day = new Date();
    day.setDate(day.getDate() - i);

    const startDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
    );

    const endDay = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate() + 1
    );

    const amount =
        await Sale.sum("totalAmount",{
            where:{
                createdAt:{
                    [Op.gte]: startDay,
                    [Op.lt]: endDay
                }
            }
        }) || 0;

    salesLabels.push(
        day.toLocaleDateString("fr-FR",{
            weekday:"short"
        })
    );

    salesData.push(amount);

}   

// ==============================
// DONNEES POUR CHART.JS
// ==============================

const purchaseData = [];

for (let i = 6; i >= 0; i--) {

    const currentDay = new Date();

    currentDay.setDate(currentDay.getDate() - i);

    const startDay = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate()
    );

    const endDay = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate() + 1
    );

    // VENTES DU JOUR

    const daySales =
        await Sale.sum("totalAmount", {
            where: {
                createdAt: {
                    [Op.gte]: startDay,
                    [Op.lt]: endDay
                }
            }
        }) || 0;

    // ACHATS DU JOUR

    const dayPurchases =
        await Purchase.sum("totalAmount", {
            where: {
                createdAt: {
                    [Op.gte]: startDay,
                    [Op.lt]: endDay
                }
            }
        }) || 0;

    salesLabels.push(
        currentDay.toLocaleDateString("fr-FR", {
            weekday: "short"
        })
    );

    salesData.push(daySales);
    purchaseData.push(dayPurchases);
}

// RENDER 
    res.render("dashboard/index", {

    // KPI
    totalRevenue: totalSales,
    profit,
    totalSales,
    totalPurchases,
    totalDrugs,
    totalStock,
    totalCustomers,
    totalSuppliers,
    totalUsers,
    
    //Ventes et Achats
    salesLabels,
    salesData,
    purchaseData,
    
    // Alertes
    lowStockBatches,
    expiredBatches,
    expiringSoon,

    // Tableaux
    recentSales,
    recentPurchases,

    // Session
    user: req.session.user

    });

  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};
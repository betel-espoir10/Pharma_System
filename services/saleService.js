const { Sale, SaleItem, Batch } = require("../models");

exports.createSale = async (data) => {
  const sale = await Sale.create({
    userId: data.userId,
    totalAmount: data.total,
  });

  for (let item of data.items) {
    const batch = await Batch.findByPk(item.batchId);

    if (batch.quantity < item.quantity) {
      throw new Error("Stock insuffisant");
    }

    batch.quantity -= item.quantity;
    await batch.save();

    await SaleItem.create({
      saleId: sale.id,
      batchId: item.batchId,
      quantity: item.quantity,
      price: item.price,
    });
  }

  return sale;
};

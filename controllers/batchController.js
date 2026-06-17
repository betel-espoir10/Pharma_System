const { Batch, Drug } = require("../models");
const { Op } = require("sequelize");

// LIST
exports.getAllBatch = async (req, res) => {
  const batches = await Batch.findAll({
    include: [
        {
          model: Drug,
        },
      ],
  });
    //EXPIRATION ALERTE
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    const expiringBatches = await Batch.findAll({
      where: {
        expirationDate: {
        [Op.lte]: next30Days
      }
    }
  });
  res.render("batches/listBatch", { batches, expiringBatches });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("batches/addBatch");
};

// ==========================
// 📄 FORMULAIRE ADD Batch
// ==========================
exports.showAddForm = async (req, res) => {
  try {
    const drugs = await Drug.findAll();

    res.render("batches/addBatch", {
      drugs,
    });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// CREATE NEW LOT
exports.createBatch = async (req, res) => {
  try {
    const { batchNumber, drugId, quantity, purchasePrice, alertThreshold, sellingPrice, expirationDate } =
      req.body;

    await Batch.create({
      batchNumber,
      quantity,
      remainingStock: quantity,
      alertThreshold,
      purchasePrice,
      sellingPrice,
      expirationDate,
      drugId,
    });

    req.flash("success", "Lot de Médicament ajouté avec succès");
    res.redirect("/batches/listBatch");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur lors de l'ajout");
    res.redirect("/batches/listBatch");
  }
};

// FORM EDIT
exports.editForm = async (req, res) => {
  const batch = await Batch.findByPk(req.params.id);
  res.render("batches/editBatch", { batch });
};

exports.showEditForm = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id);
    const drugs = await Drug.findAll();

    if (!batch) {
      req.flash("error", "Lot de Médicament introuvable");
      return res.redirect("/batches/listBatch");
    }

    res.render("batches/editBatch", {
      batch,
      drugs,
    });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// UPDATE
exports.updateBatch = async (req, res) => {
  try {
     const { batchNumber, quantity, alertThreshold, purchasePrice, sellingPrice, expirationDate, drugId } =
      req.body;
     const batch = await Batch.findByPk(req.params.id);

    if (!batch) {
      req.flash("error", " Lot de Médicament introuvable");
      return res.redirect("/batches/listBatch");
    }

    await batch.update({
      batchNumber,
      quantity,
      remainingStock: quantity,
      alertThreshold,    
      purchasePrice,
      sellingPrice,
      expirationDate,
      drugId,
    });

    req.flash("success", "Lot de Médicament mis à jour");
    res.redirect("/batches/listBatch");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur mise à jour");
    res.redirect("/batches/listBatch");
  }
};

// DELETE
exports.deleteBatch = async (req, res) => {
  try {
    await Batch.destroy({
      where: { id: req.params.id },
    });

    req.flash("success", "Lot de Médicament supprimé avec success");
    res.redirect("/batches/listBatch");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur suppression");
    res.redirect("/batches/listBatch");
  }
};

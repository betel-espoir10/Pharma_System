const { Drug, Category, Manufacturer } = require("../models");

// LIST
exports.getAllDrug = async (req, res) => {
  const drugs = await Drug.findAll({
    include: [
        {
          model: Category,
        },
        {
          model: Manufacturer,
        },
      ],
  });
  res.render("drugs/listDrug", { drugs });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("drugs/addDrug");
};

// ==========================
// 📄 FORMULAIRE ADD DRUG
// ==========================
exports.showAddForm = async (req, res) => {
  try {
    const categories = await Category.findAll();
    const manufacturers = await Manufacturer.findAll();

    res.render("drugs/addDrug", {
      categories,
      manufacturers,
    });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// STORE
exports.store = async (req, res) => {
  try {
    const { name, description, dosage, form, categoryId, manufacturerId } =
      req.body;

    await Drug.create({
      name,
      description,
      dosage,
      form,
      categoryId,
      manufacturerId,
    });

    req.flash("success", "Médicament ajouté avec succès");
    res.redirect("/drugs/listDrug");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur lors de l'ajout");
    res.redirect("/drugs/listDrug");
  }
};

// FORM EDIT
exports.editForm = async (req, res) => {
  const drug = await Drug.findByPk(req.params.id);
  res.render("drugs/editDrug", { drug });
};

exports.showEditForm = async (req, res) => {
  try {
    const drug = await Drug.findByPk(req.params.id);
    const categories = await Category.findAll();
    const manufacturers = await Manufacturer.findAll();

    if (!drug) {
      req.flash("error", "Médicament introuvable");
      return res.redirect("/drugs/listDrug");
    }

    res.render("drugs/editDrug", {
      drug,
      categories,
      manufacturers,
    });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { name, description, dosage, form, categoryId, manufacturerId } =
      req.body;

    const drug = await Drug.findByPk(req.params.id);

    if (!drug) {
      req.flash("error", "Médicament introuvable");
      return res.redirect("/drugs/listDrug");
    }

    await drug.update({
      name,
      description,
      dosage,
      form,
      categoryId,
      manufacturerId,
    });

    req.flash("success", "Médicament mis à jour");
    res.redirect("/drugs/listDrug");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur mise à jour");
    res.redirect("/drugs/listDrug");
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    await Drug.destroy({
      where: { id: req.params.id },
    });

    req.flash("success", "Médicament supprimé");
    res.redirect("/drugs");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur suppression");
    res.redirect("/drugs/listDrug");
  }
};

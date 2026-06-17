const { Supplier } = require("../models");

// LIST
exports.getAllSupplier = async (req, res) => {
  const suppliers = await Supplier.findAll();
  res.render("suppliers/listSupplier", { suppliers });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("suppliers/addSupplier");
};

// ==========================
// 📄 FORMULAIRE ADD SUPPLIER
// ==========================
exports.showAddForm = async (req, res) => {
  try {
    res.render("suppliers/addSupplier");
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// CREATE NEW SUPPLIER
exports.createSupplier = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    await Supplier.create({
      name,
      phone,
      address,
    });

    req.flash("success", "Fournisseur ajouté avec succès");
    res.redirect("/suppliers/listSupplier");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur lors de l'ajout");
    res.redirect("/suppliers/listSupplier");
  }
};

// FORM EDIT
exports.editForm = async (req, res) => {
  const suppliers = await Supplier.findByPk(req.params.id);
  res.render("suppliers/editSupplier", { suppliers });
};

exports.showEditForm = async (req, res) => {
  try {
    const supp = await Supplier.findByPk(req.params.id);

    if (!supp) {
      req.flash("error", "Fournisseur introuvable");
      return res.redirect("/suppliers/listSupplier");
    }

    res.render("suppliers/editSupplier", { supp, });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// UPDATE
exports.updateSupplier = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const supp = await Supplier.findByPk(req.params.id);
    if (!supp) {
      req.flash("error", "Fournisseur introuvable");
      return res.redirect("/suppliers/listSupplier");
    }

    await supp.update({
      name,
      phone,
      address,
    });

    req.flash("success", "Fournisseur mis à jour");
    res.redirect("/suppliers/listSupplier");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur mise à jour");
    res.redirect("/suppliers/listSupplier");
  }
};

// DELETE
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.destroy({
      where: { id: req.params.id },
    });

    req.flash("success", "Founisseur supprimé");
    res.redirect("/suppliers/listSupplier");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur suppression");
    res.redirect("/suppliers/listSupplier");
  }
};

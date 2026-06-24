const { Customer } = require("../models");

// LIST
exports.getAllCustomer = async (req, res) => {
  const customers = await Customer.findAll();
  res.render("customers/listCustomer", { customers });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("customers/addCustomer");
};

// ==========================
// 📄 FORMULAIRE ADD CUSTOMER
// ==========================
exports.showAddForm = async (req, res) => {
  try {
    res.render("customers/addCustomer");
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// STORE
exports.store = async (req, res) => {
  try {
    console.log("DONNEES REÇUES :", req.body);
    const { name, phone, address } = req.body;
    
    await Customer.create({
      name,
      phone,
      address,
    });
    
    req.flash("success", "Client ajouté avec succès");
    res.redirect("/customers/listCustomer");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur lors de l'ajout");
    res.redirect("/customers/listCustomer");
  }

};

// FORM EDIT
exports.editForm = async (req, res) => {
  const customers = await Customer.findByPk(req.params.id);
  res.render("customers/editCustomer", { customers });
};

exports.showEditForm = async (req, res) => {
  try {
    const cust = await Customer.findByPk(req.params.id);

    if (!cust) {
      req.flash("error", "Client introuvable");
      return res.redirect("/customers/listCustomer");
    }

    res.render("customers/editCustomer", { cust, });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const cust = await Customer.findByPk(req.params.id);

    if (!cust) {
      req.flash("error", "Client introuvable");
      return res.redirect("/customers/listCustomer");
    }

    await cust.update({
      name,
      phone,
      address,
    });

    req.flash("success", "Client mis à jour");
    res.redirect("/customers/listCustomer");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur mise à jour");
    res.redirect("/customers/listCustomer");
  }
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.destroy({
      where: { id: req.params.id },
    });

    req.flash("success", "Client supprimé");
    res.redirect("/customers/listCustomer");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur suppression");
    res.redirect("/customers/listCustomer");
  }
};

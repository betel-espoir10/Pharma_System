const { Role } = require("../models");
const { Op } = require("sequelize");

// LIST
exports.getAllRole = async (req, res) => {
  const roles = await Role.findAll({
     where: {
      name: {
         [Op.ne]: "ADMIN"
      }
   }
  });
  res.render("roles/listRole", { roles });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("roles/addRole");
};

// ==========================
// 📄 FORMULAIRE ADD ROLE
// ==========================
exports.showAddForm = async (req, res) => {
  try {
    res.render("roles/addRole");
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// CREATE NEW ROLE
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    await Role.create({
      name,
    });

    req.flash("success", "Role ajouté avec succès");
    res.redirect("/roles/addRole");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur lors de l'ajout");
    res.redirect("/roles/addRole");
  }
};

// FORM EDIT
exports.editForm = async (req, res) => {
  const roles = await Role.findByPk(req.params.id);
  res.render("roles/editRole", { roles });
};

exports.showEditForm = async (req, res) => {
  try {
    const rol = await Role.findByPk(req.params.id);

    if (!rol) {
      req.flash("error", "Role introuvable");
      return res.redirect("/roles/listRole");
    }

    res.render("roles/editRole", { rol });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// UPDATE
exports.updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const rol = await Customer.findByPk(req.params.id);
    if (!rol) {
      req.flash("error", "Role introuvable");
      return res.redirect("/roles/listRole");
    }

    await rol.update({
      name,
    });

    req.flash("success", "Role mis à jour");
    res.redirect("/roles/listRole");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur mise à jour");
    res.redirect("/roles/listRole");
  }
};

// DELETE
exports.deleteRole = async (req, res) => {
  try {
    await Role.destroy({
      where: { id: req.params.id },
    });

    req.flash("success", " Role supprimé");
    res.redirect("/roles/listRole");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur suppression");
    res.redirect("/roles/listRole");
  }
};

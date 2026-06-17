const { User, Role } = require("../models");
const bcrypt = require("bcrypt");

// LIST
exports.getAllUser = async (req, res) => {
  const users = await User.findAll({
    include: [Role]
  });
  res.render("users/listUser", { users });
};

// FORM CREATE
exports.createForm = (req, res) => {
  res.render("users/addUser");
};

// ==========================
// 📄 FORMULAIRE ADD USERS
// ==========================
exports.showAddForm = async (req, res) => {
  
    try {
       let roles;
// SI UTILISATEUR CONNECTE
    if (
      req.session.user &&
      req.session.user.role &&
      req.session.user.role.name === "ADMIN"
    ) {
      roles = await Role.findAll();
    }

// SINON INSCRIPTION NORMALE

    else {
      roles = await Role.findAll({
        where: {
          name: ["PHARMACIEN.(NE)", "CAISSIER.(E)"]
        }
    });
      }
      res.render("users/addUser", {
      roles
    });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// CREATE NEW USER
exports.createUser = async (req, res) => {
  const { name, email, password, status, roleId } = req.body;
  const adminRole = await Role.findOne({ 
        where: { name: "ADMIN" }
    });

    if (
      parseInt(roleId) === adminRole.id &&
      req.user.role.name !== "ADMIN"
    ) {

      return res.status(403).send(
        "Accès refusé"
      );
    }
    
  try {
    
    if (!email || !password) {
      return res.render("login", { error: "Champs requis !" });
    }

    let user = await User.findOne({ where: { email } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("login", { error: "Mot de passe incorrect" });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      status,
      roleId,
    });
 };
    req.flash("success", "User ajouté avec succès");
    res.redirect("/users/listUser");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur lors de l'ajout");
    res.redirect("/users/listUser");
  }
};

// FORM EDIT
exports.editForm = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.render("users/editUser", { user });
};

exports.showEditForm = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const roles = await Role.findAll();

    if (!user) {
      req.flash("error", " User introuvable");
      return res.redirect("/users/listUser");
    }

    res.render("users/editUser", {
      user,
      roles,
    });
  } catch (error) {
    console.error(error);
    res.send("Erreur chargement formulaire");
  }
};

// UPDATE
exports.updateUser = async (req, res) => {
      const { name, email, status, roleId } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash("error", "User introuvable");
      return res.redirect("/users/listUser");
    }

    await user.update({
      name,
      email,
      status,
      roleId,
    });

    req.flash("success", "User mis à jour");
    res.redirect("/users/listUser");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur mise à jour");
    res.redirect("/users/listUser");
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });

    req.flash("success", "User supprimé avec success");
    res.redirect("/users/listUser");
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur suppression");
    res.redirect("/users/listUser");
  }
};

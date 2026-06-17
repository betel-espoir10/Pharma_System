const { Manufacturer } = require("../models");

//LIST
exports.manufacturerList = async (req, res) => {
  const manu = Manufacturer.findAll();
  return res.render("/manufacturer/listManu", { manu });
};

//FORM CREATE
exports.manufacturerAddForm = async (req, res) => {
  res.render("manufacturer/addManu");
};

//ADD MANUFACTURER
exports.manufacturerPost = async (req, res) => {
  const { name } = req.body;
  await Manufacturer.create({
    name,
  });
  res.redirect("/manufacturer/addManu");
};

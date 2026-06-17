const { Category } = require("../models");

//LIST
exports.categoryList = async (req, res) => {
  const categories = Category.findAll();
  return res.render("/category/listCategory", { categories });
};

//FORM CREATE
exports.categoryAddForm = async (req, res) => {
  res.render("category/addCategory");
};

//ADD CATEGORY
exports.categoryPost = async (req, res) => {
  const { name } = req.body;
  await Category.create({
    name,
  });
  res.redirect("/category/addCategory");
};

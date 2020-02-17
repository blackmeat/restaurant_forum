const db = require("../models")
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category
      .findAll()
      .then((categories) => {
        res.render("admin/categories", { categories })
      })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "The name didn\'t exist!!")
      res.redirect("back")
    }
    return Category.create({
      name: req.body.name
    }).then((category) => {
      req.flash("success_messages", "The new category was successful created!!")
      res.redirect("/admin/categories")
    })
  }
}

module.exports = categoryController
const db = require("../models")
const Category = db.Category
const categoryService = require("../services/categoryService")

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render("admin/categories", data)
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
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "The name didn\'t exist!!")
      res.redirect("back")
    }
    Category
      .findByPk(req.params.id)
      .then((category) => {
        return category.update({
          name: req.body.name
        }).then((category) => {
          req.flash("success_messages", "The new category was updated successful!!")
          res.redirect("/admin/categories")
        })
      })
  },

  deleteCategory: (req, res) => {
    return Category
      .findByPk(req.params.id)
      .then((category) => {
        category
          .destroy()
          .then((category) => {
            req.flash("success_messages", "The category was deleted successful")
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryController
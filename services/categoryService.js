const db = require("../models")
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    Category
      .findAll()
      .then((categories) => {
        if (req.params.id) {
          Category
            .findByPk(req.params.id)
            .then((category) => {
              callback({ categories, category })
            })
        } else {
          return callback({ categories })
        }

      })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: "error", message: "The name didn\'t exist!!" })
      // req.flash("error_messages", "The name didn\'t exist!!")
      // res.redirect("back")
    }
    return Category.create({
      name: req.body.name
    }).then((category) => {
      callback({ status: "success", message: "The new category was successful created!!" })
      // req.flash("success_messages", "The new category was successful created!!")
      // res.redirect("/admin/categories")
    })
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: "error", message: "The name didn\'t exist!!" })
      // req.flash("error_messages", "The name didn\'t exist!!")
      // res.redirect("back")
    }
    Category
      .findByPk(req.params.id)
      .then((category) => {
        return category.update({
          name: req.body.name
        }).then((category) => {
          callback({ status: "success", message: "The new category was updated successful" })
          // req.flash("success_messages", "The new category was updated successful!!")
          // res.redirect("/admin/categories")
        })
      })
  },

  deleteCategory: (req, res, callback) => {
    return Category
      .findByPk(req.params.id)
      .then((category) => {
        category
          .destroy()
          .then((category) => {
            callback({ status: "success", message: "The category was deleted successful" })
            // req.flash("success_messages", "The category was deleted successful")
            // res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryService
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
  }
}

module.exports = categoryService
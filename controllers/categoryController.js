const db = require("../models")
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category
      .findAll()
      .then((categories) => {
        res.render("admin/categories", { categories })
      })
  }
}

module.exports = categoryController
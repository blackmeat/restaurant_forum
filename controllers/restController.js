const db = require("../models")
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {}
    let categoryId = ""
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery["CategoryId"] = categoryId
    }
    Restaurant
      .findAll({ include: Category, where: whereQuery })
      .then((restaurants) => {
        const data = restaurants.map((restaurant) => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))
        console.log(data[0])
        Category
          .findAll()
          .then((categories) => {
            return res.render("restaurants", {
              restaurants: data,
              categories,
              categoryId
            })
          })

      })
  },

  getRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id, { include: Category })
      .then((restaurant) => {
        res.render("restaurant", { restaurant })
      })
  },


}

module.exports = restController
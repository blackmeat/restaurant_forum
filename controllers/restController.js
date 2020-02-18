const db = require("../models")
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant
      .findAll({ include: Category })
      .then((restaurants) => {
        const data = restaurants.map((restaurant) => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))
        console.log(data[0])
        return res.render("restaurants", { restaurants: data })
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
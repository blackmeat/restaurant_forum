const db = require("../../models")
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant
      .findAll({ include: [Category] })
      .then((restaurants) => {
        res.json({ restaurants })
      })
  }
}
module.exports = adminController
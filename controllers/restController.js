const db = require("../models")
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ""
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery["CategoryId"] = categoryId
    }
    Restaurant
      .findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit })
      .then((results) => {
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(results.count / pageLimit)
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1

        const data = results.rows.map((restaurant) => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))
        // console.log(data[0])
        Category
          .findAll()
          .then((categories) => {
            return res.render("restaurants", {
              restaurants: data,
              categories,
              categoryId,
              page,
              pages,
              totalPage,
              prev,
              next
            })
          })

      })
  },

  getRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] }
        ]
      })
      .then((restaurant) => {
        // console.log(restaurant.Comments[0].dataValues.User.name)
        res.render("restaurant", { restaurant })
      })
  },


}

module.exports = restController
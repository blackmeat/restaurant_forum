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
          description: restaurant.dataValues.description.substring(0, 50),
          isFavorited: req.user.FavoriteRestaurants.map(d => d.id).includes(restaurant.id),
          isLiked: req.user.LikeRestaurants.map(d => d.id).includes(restaurant.id)
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
          { model: User, as: "LikeUsers" },
          { model: User, as: "FavoriteUsers" },
          { model: Comment, include: [User] }
        ]
      })
      .then((restaurant) => {
        // console.log(restaurant.Comments[0].dataValues.User.name)
        restaurant.viewCounts += 1
        restaurant.save()
        const isFavorited = restaurant.FavoriteUsers.map(d => d.id).includes(req.user.id)
        const isLiked = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)
        res.render("restaurant", { restaurant, isFavorited, isLiked })
      })
  },

  getRestaurantDashboard: (req, res) => {
    Restaurant
      .findOne({ include: [Category, Comment], where: { id: req.params.id } })
      .then((restaurant) => {
        const commentAmount = restaurant.Comments.length
        res.render("dashboard", { restaurant, commentAmount })
      })
  },

  getFeeds: (req, res) => {
    Restaurant
      .findAll({ limit: 10, order: [["createdAt", "DESC"]], include: [Category] })
      .then((restaurants) => {
        Comment
          .findAll({ limit: 10, order: [["createdAt", "DESC"]], include: [User, Restaurant] })
          .then((comments) => {
            res.render("feeds", { restaurants, comments })
          })
      })
  },

  getTopRestaurants: (req, res) => {
    Restaurant
      .findAll({
        include: [{
          model: User, as: "FavoriteUsers"
        }]
      })
      .then((restaurants) => {
        restaurants = restaurants.map((restaurant) => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50),
          FavoriteCount: restaurant.FavoriteUsers.length,
          isFavorited: req.user.FavoriteRestaurants.map(d => d.id).includes(restaurant.id)
        }))
        restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount)
        restaurants = restaurants.slice(0, 10)
        res.render("topRestaurants", { restaurants })
      })
  }
}

module.exports = restController
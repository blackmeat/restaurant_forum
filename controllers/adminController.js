const db = require("../models")
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant
      .findAll()
      .then((restaurants) => { res.render("admin/restaurants", { restaurants }) })
  },

  createRestaurant: (req, res) => {
    res.render("admin/create")
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "Name didn't exist!")
      return res.redirect("back")
    }
    return Restaurant.create({
      name: req.body.name,
      address: req.body.address,
      tel: req.body.tel,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    }).then((restaurants) => {
      req.flash("success_messages", "restaurant was successful created")
      res.redirect("/admin/restaurants")
    })
  },

  getRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id)
      .then((restaurant) => {
        res.render("admin/restaurant", { restaurant })
      })
  },

  editRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id)
      .then((restaurant) => {
        res.render("admin/create", { restaurant })
      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "餐廳名稱不存在")
      res.redirect("back")
    }

    return Restaurant
      .findByPk(req.params.id)
      .then((Restaurant) => {
        Restaurant.update({
          name: req.body.name,
          address: req.body.address,
          tel: req.body.tel,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        }).then((restaurant) => {
          req.flash("success_messages", "restaurant was successful update")
          res.redirect("/admin/restaurants")
        })
      })
  },

  deleteRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id)
      .then((restaurant) => {
        restaurant
          .destroy()
          .then((restaurant) => {
            res.redirect("/admin/restaurants")
          })
      })
  }

}

module.exports = adminController
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
  }

}

module.exports = adminController
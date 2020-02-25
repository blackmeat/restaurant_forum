const fs = require('fs')
const db = require("../models")
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require("imgur-node-api")
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require("../services/adminService")

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render("admin/restaurants", data)
    })
  },

  createRestaurant: (req, res) => {
    Category
      .findAll()
      .then((categories) => {
        res.render("admin/create", { categories })
      })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data["status"] === "error") {
        req.flash("error_messages", data["message"])
        return res.redirect("back")
      }
      req.flash("success_messages", data["message"])
      res.redirect("/admin/restaurants")
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render("admin/restaurant", data)
    })
  },

  editRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id)
      .then((restaurant) => {
        Category
          .findAll()
          .then((categories) => {
            res.render("admin/create", { restaurant, categories })
          })

      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash("error_messages", "餐廳名稱不存在")
      res.redirect("back")
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant
        .findByPk(req.params.id)
        .then((Restaurant) => {
          Restaurant.update({
            name: req.body.name,
            address: req.body.address,
            tel: req.body.tel,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: Restaurant.image,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            req.flash("success_messages", "restaurant was successful update")
            res.redirect("/admin/restaurants")
          })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data["status"] === "success") {
        return res.redirect("/admin/restaurants")
      }
    })
  },

  getUsers: (req, res) => {
    User
      .findAll()
      .then((users) => {
        res.render("admin/users", { users })
      })
  },

  putUsers: (req, res) => {
    console.log(req)
    User
      .findByPk(req.params.id)
      .then((user) => {
        user.update({
          isAdmin: !user.isAdmin
        })
          .then((user) => {
            req.flash("success_messages", "Users  was successfully update")
            res.redirect("/admin/users")
          })
      })
  }

}

module.exports = adminController
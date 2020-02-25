const fs = require('fs')
const db = require("../models")
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require("imgur-node-api")
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res, callback) => {
    Restaurant
      .findAll({ include: [Category] })
      .then((restaurants) => {
        callback({ restaurants })
      })
  },

  getRestaurant: (req, res, callback) => {
    Restaurant
      .findByPk(req.params.id, { include: [Category] })
      .then((restaurant) => {
        callback({ restaurant })
      })
  },

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: "error", message: "Name didn't exist!" })
      // req.flash("error_messages", "Name didn't exist!")
      // return res.redirect("back")
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          callback({ status: "success", message: "restaurant was successfully created" })
          // req.flash('success_messages', 'restaurant was successfully created')
          // return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        address: req.body.address,
        tel: req.body.tel,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurants) => {
        callback({ status: "success", message: "restaurant was successfully created" })
        // req.flash("success_messages", "restaurant was successful created")
        // res.redirect("/admin/restaurants")
      })
    }
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: "error", message: "The restaurant doesn't exist!!" })
      // req.flash("error_messages", "餐廳名稱不存在")
      // res.redirect("back")
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant
          .findByPk(req.params.id)
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
                callback({ status: "success", message: "The restaurant was updated successfully" })
                // req.flash('success_messages', 'restaurant was successfully to update')
                // res.redirect('/admin/restaurants')
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
            callback({ status: "success", message: "The restaurant was updated successfully" })
            // req.flash("success_messages", "restaurant was successful update")
            // res.redirect("/admin/restaurants")
          })
        })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    Restaurant
      .findByPk(req.params.id)
      .then((restaurant) => {
        restaurant
          .destroy()
          .then((restaurant) => {
            callback({ status: "success", message: "" })
          })
      })
  }
}
module.exports = adminController
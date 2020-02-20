const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const imgur = require("imgur-node-api")
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash("error_messages", "兩次密碼輸入不相同")
      return res.redirect("/signup")
    } else {
      User
        .findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash("error_messages", "信箱已經被註冊過")
            return res.redirect("/signup")
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash("success_messages", "成功註冊！！")
              return res.redirect('/signin')
            })
          }
        })
    }
  },
  signInPage: (req, res) => {
    res.render("signin")
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入")
    res.redirect("/restaurants")
  },
  logout: (req, res) => {
    req.flash("success_messages", "已經成功登出")
    req.logout()
    res.redirect("/signin")
  },

  getUser: (req, res) => {
    User
      .findByPk(req.params.id, {
        include:
          [{ model: Comment, include: [Restaurant] }]
      })
      .then((User) => {
        console.log(User.Comments)
        const restAmount = User.Comments.length
        res.render("profile/user", { User, restAmount })
      })
  },

  editUser: (req, res) => {
    User
      .findByPk(req.params.id)
      .then((user) => {
        res.render("profile/edit", { user })
      })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "使用者姓名尚未填入")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User
          .findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then((user) => {
                req.flash('success_messages', "User information was  update successfully")
                res.redirect(`/users/${user.id}`)
              })
          })
      })
    } else
      return User
        .findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image,
          })
            .then((user) => {
              req.flash('success_messages', "User information was  update successfully")
              res.redirect(`/users/${user.id}`)
            })
        })
  },

  addFavorite: (req, res) => {
    Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((favorite) => {
        res.redirect("back")
      })
  },

  removeFavorite: (req, res) => {
    Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
        res.redirect("back")
      })
  },

  addLike: (req, res) => {
    Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((like) => {
        console.log(like)
        res.redirect("back")
      })
  },

  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
        res.redirect("back")
      })
  }

}

module.exports = userController

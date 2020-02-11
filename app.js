const express = require("express")
const app = express()
const port = 3000
const exhbs = require("express-handlebars")
const db = require("./models")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("./config/passport")

app.engine("handlebars", exhbs({ defaultLayout: "main" })) // Handlebars 註冊樣板引擎
app.set("view engine", "handlebars") // 設定使用 Handlebars 做為樣板引擎
app.use(bodyParser.urlencoded({ extended: true })) //設定使用 body-parser 解析表單內容
app.use(session({ secret: "12345", resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  db.sequelize.sync()
  console.log("App is running!!")
})
require("./routes")(app, passport)
const express = require("express")
const app = express()
const port = 3000
const exhbs = require("express-handlebars")
const db = require("./models")

app.engine("handlebars", exhbs({ defaultLayout: "main" })) // Handlebars 註冊樣板引擎
app.set("view engine", "handlebars") // 設定使用 Handlebars 做為樣板引擎

app.listen(port, () => {
  db.sequelize.sync()
  console.log("App is running!!")
})
require("./routes")(app)
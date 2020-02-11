const express = require("express")
const app = express()
const port = 3000
const exhbs = require("express-handlebars")

app.engine("handlebars", exhbs()) // Handlebars 註冊樣板引擎
app.set("view engine", "handlebars") // 設定使用 Handlebars 做為樣板引擎

app.listen(port, () => {
  console.log("App is running!!")
})

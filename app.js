const express = require("express");
const handlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;
const SESSION_SECRET = "secret";

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine("hbs", handlebars({ extname: ".hbs" }));
// 設定使用 Handlebars 做為樣板引擎
app.set("view engine", "hbs");
// 使用body-parser，表示所有的請求都會先被 body-parser進行處理
app.use(express.urlencoded({ extended: true }));

// session後接passport & flash
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);

app.use(passport.initialize()); // 初始化 Passport
app.use(passport.session()); // 啟動 session 功能

app.use(flash()); // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages"); // 設定 success_msg 訊息
  res.locals.error_messages = req.flash("error_messages"); // 設定 warning_msg 訊息
  next();
});

// 每個路由發送進來的請求，都會先經過 app.use() 的處理
app.use(routes);

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});

module.exports = app;

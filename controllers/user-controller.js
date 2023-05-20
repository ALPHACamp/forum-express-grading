const bcrypt = require("bcryptjs"); //載入 bcrypt
const db = require("../models");
const { User } = db;
const userController = {
  signUpPage: (req, res) => {
    res.render("signup");
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error("Email already exists!");
        return bcrypt.hash(req.body.password, 10); // 前面加 return
      })
      .then((hash) =>
        User.create({
          //上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then(() => {
        req.flash("success_messages", "成功註冊帳號！"); //並顯示成功訊息
        res.redirect("/signin");
      })
      .catch((error) => next(error));
  },
  signInPage: (req, res) => {
    res.render("signin");
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/restaurants");
  },
  logout: (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_messages", "你已經成功登出。");
      res.redirect("/signin");
    });
  },
};
module.exports = userController;

/* For front-end system */

const bcrypt = require('bcryptjs');
const db = require('../models');
const { User } = db;
const userController = {
  signUpPage: (req, res) => {
    res.render('signup');
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      // note 直接丟出error的物件
      throw new Error('Passwords do not match');
    }

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!');

        return bcrypt.hash(req.body.password, 10);
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', 'Account is signed up successfully !');
        res.redirect('/signin');
      })
      .catch(err => next(err));
    // note next()帶入err參數變成Error物件，代表使用express所給予的error處理，也可以自己寫一個
  },
  signInPage: (req, res) => {
    res.render('signin');
  },
  signIn: (req, res) => {
    // note 已用passport來驗證，所以無需再多寫驗證邏輯
    req.flash('success_messages', 'Login successfully !!');
    res.redirect('/restaurants');
  },
  logout: (req, res, next) => {
    req.logout(err => {
      if (err) {
        return next(err);
      }
      req.flash('success_messages', 'Logout successfully !!');
      res.redirect('/signin');
    });
  }
};

module.exports = userController;

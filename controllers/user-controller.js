const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('兩次密碼輸入不同！')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('信箱重複！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({ name: req.body.name, email: req.body.email, password: hash }))
      .then(() => {
        req.flash('success_msg', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('找不到使用者！')

        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  }
}

module.exports = userController

const bcrypt = require('bcrypt')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('密碼不一致')
    User.findOne({
      where: { email }
    })
      .then(user => {
        if (user) throw new Error('用戶已存在')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success', '註冊成功')
        res.redirect('/signin')
      })
      .catch(error => next(error))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success', '登入成功')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.logout(() => {
      req.flash('success', '登出成功')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    const userId = req.user.id
    return User.findByPk(id, {
      raw: true
    })
      .then(user => {
        console.log(id, userId)
        if (!user) throw new Error("User didn't exist")
        // if (id !== userId) throw new Error('無法更改他人資料')
        return res.render('users/profile', { user, userId })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    res.render('users/edit')
  },
  putUser: (req, res, next) => {
    res.send('putUser')
  }
}

module.exports = userController

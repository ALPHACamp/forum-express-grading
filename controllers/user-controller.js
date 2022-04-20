const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signIn')
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
    const userId = Number(req.user.id)
    const userParamsId = Number(req.params.id)
    if (userId !== userParamsId) {
      throw new Error('User is not allow to edit the profile of other people !')
    }
    return (
      User.findByPk(userParamsId, { raw: true })
        // return User.findByPk(req.user.id, { raw: true })
        .then(user => {
          if (!user) throw new Error('User is not applied !')
          return res.render('users/profile', user)
        })
        .catch(err => next(err))
    )
  }
}

module.exports = userController

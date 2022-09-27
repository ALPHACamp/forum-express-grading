const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Comment, Restaurant, User } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name: name,
        email: email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
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
  getUser: (req, res) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Restaurant.findAll({
        include: [
          {
            model: Comment,
            where: { userId: req.params.id }
          }],
        raw: true
      })
    ])
      .then(([user, restaurants]) => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/profile', {
          user: user.toJSON(),
          commentCount: restaurants.length,
          restaurants
        })
      })
      .catch(err => console.log(err))
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist")
        return res.render('users/edit', { user })
      })
      .catch(err => console.log(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入 Name')
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => console.log(err))
  }
}

module.exports = userController

const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
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
    return Promise.all([
      User.findByPk(req.params.id, {
        raw: true
      }),
      Comment.findAll({
        include: Restaurant,
        where: { userId: req.params.id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        console.log(comments)
        if (!user) throw new Error('User not exists')
        const haveComment = !!comments.length
        res.render('users/profile', { user, comments, haveComment })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('users/edit', { user })
      })
  },
  putUser: (req, res, next) => {
    const { name, email } = req.body
    const { file } = req
    if (!name) throw new Error('Name is required.')
    // if (!email) throw new Error('Email is required.')
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('user not exist.')
        console.log(filePath)
        return user.update({
          name,
          email,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('/users/1')
        // res.redirect(`/user/${user.id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

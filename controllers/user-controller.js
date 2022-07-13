const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { EditUserProfileError } = require('../helpers/error-helpers')
const restaurantController = require('./restaurant-controller')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

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
      .catch(next)
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
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        include: [
          User,
          Restaurant
        ],
        where: {
          ...userId ? { userId } : {}
        },
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        const data = comments.rows.map(c => ({ ...c }))
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/profile', {
          user,
          comments,
          data
        })
      })
      .catch(next)
  },
  editUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(next)
  },
  putUser: (req, res, next) => {
    const id = req.params.id
    const userId = req.user.id
    const { name } = req.body
    if (!name) throw new Error('Username is required!')
    const { file } = req
    if (Number(userId) !== Number(id)) throw new EditUserProfileError('Edit not allowed!')
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => {
        if (err.name === EditUserProfileError) {
          req.flash('error_messages', 'Edit not allowed!')
          return res.redirect('back')
        }
        next(err)
      })
  }
}

module.exports = userController

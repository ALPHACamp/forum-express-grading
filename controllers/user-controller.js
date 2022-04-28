const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Restaurant, Comment, User } = require('../models')

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
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: Comment, include: Restaurant }
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      let restaurantName = []
      let restaurantId = []
      user.Comments.map(comment => {
        restaurantName.push(comment.Restaurant.name)
        return restaurantId.push(comment.Restaurant.id)
      })
      restaurantName = [...new Set(restaurantName)]
      restaurantId = [...new Set(restaurantId)]
      const restaurantList = restaurantName.map((item, index) => ({ name: item, id: restaurantId[index] }))
      const restaurantCount = restaurantList.length
      return res.render('users/profile', {
        user: user.toJSON(),
        id: Number(req.user.id),
        email: req.user.email,
        restaurantCount,
        restaurantList
      })
    } catch (err) {
      console.log(err)
    }
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user doesn't exist!")
        // console.log(user)
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    // console.log(req.user)
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

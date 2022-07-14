// FilePath: controllers/user-controllers.js
// Include modules
const bcrypt = require('bcryptjs')
const db = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { User, Comment, Restaurant } = db
// Options: localFileHandler, imgurFileHandler
const fileHandler = require('../helpers/file-helpers').imgurFileHandler

// User Controller
const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body

      // Check if password equals passwordCheck
      if (password !== passwordCheck) throw new Error('Passwords does not match Password Check!')

      // Check if email already signed up
      const userFound = await User.findOne({ where: { email } })
      if (userFound) throw new Error('Email already exists!')

      // Create new user
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      req.flash('success_messages', 'Sign up succeed!')
      return res.redirect('/signin')
    } catch (err) { next(err) }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in succeed!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Log out succeed!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const [targetUser, commentedRestaurants] = await Promise.all([
        User.findByPk(req.params.id, { raw: true }),
        Comment.findAll({
          attributes: ['restaurantId'],
          include: Restaurant,
          where: { userId: req.params.id },
          group: ['restaurantId'],
          nest: true,
          raw: true
        })
      ])

      if (!targetUser) throw new Error("User didn't exist!")
      res.render('users/profile', {
        user: getUser(req),
        targetUser,
        commentedRestaurants
      })
    } catch (err) { next(err) }
  },
  editUser: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const targetUser = await User.findByPk(req.params.id, { raw: true })

      if (!targetUser) throw new Error("User didn't exist!")
      if (loginUser.id !== targetUser.id) {
        req.flash('error_messages', "No permission to edit other's profile")
        res.redirect(`/users/${targetUser.id}`)
      }

      res.render('users/edit', { user: targetUser })
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      // Check if required info got null
      const { name } = req.body
      if (!name) throw new Error('User name is required!')

      // Update user info
      const loginUser = getUser(req)
      const { file } = req
      const [filePath, user] = await Promise.all([
        fileHandler(file),
        User.findByPk(req.params.id)
      ])

      if (!user) throw new Error('User did not exist!')
      if (loginUser.id !== user.id) throw new Error("No permission to edit other's profile!")

      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) { next(err) }
  }
}

module.exports = userController

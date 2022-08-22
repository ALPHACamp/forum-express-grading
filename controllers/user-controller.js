const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  getSignUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    // check if the password confirmation does match
    if (req.body.password !== req.body.passwordCheck) throw new Error('The password confirmation does not match.')
    // check if the email already exists
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        // else store the user register information
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Register successfully! Please login to your account.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  getSignInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', 'You have successfully logged out.')
    req.logout()
    res.redirect('/signin')
  },
  // get user's profile page
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(userProfile => {
        if (!userProfile) throw new Error("User doesn't exist.")
        res.render('users/profile', {
          user: getUser(req),
          userProfile
        })
      })
      .catch(e => next(e))
  },
  // get edit user's profile page
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(userProfile => {
        if (!userProfile) throw new Error("User doesn't exist.")
        res.render('users/edit', { user: userProfile })
      })
      .catch(e => next(e))
  },

  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (!name.trim()) throw new Error('User name is required!')
    return Promise
      .all([
        User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist.")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(e => next(e))
  }
}

module.exports = userController

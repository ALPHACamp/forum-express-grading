// import packages
const bcrypt = require('bcryptjs')

// import models
const { User } = require('../models')

// import helper
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error(`password and passwordCheck don't match!`)

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) throw new Error(`This email has been register! Please use another one.`)

        // throw out async event & make .then at same level
        // return 'hash' to next .then
        return bcrypt.hash(password, 10)
      })
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then(() => {
        req.flash('success_messages', 'Successfully sign up! Now you are able to use this website.')
        res.redirect('/signin')
      })
      .catch((error) => next(error))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Successfully sign in!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Successfully log out!')
    // log out = server will clear session
    req.logout(() => {
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('This user does not exist!')

      return res.render('users/profile', { user })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('This user does not exist!')

      return res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const userId = req.params.id
      if (!name) throw new Error('Name is the required field!')

      const { file } = req
      const [user, filePath] = await Promise.all([User.findByPk(userId), imgurFileHandler(file)])
      if (!user) throw new Error('This user does not exist!')

      await user.update({ name, image: filePath || user.image })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${userId}`)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController

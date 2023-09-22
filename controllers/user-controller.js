const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')
const DEFAULT_AVATAR = 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg'
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const userInput = req.body
    // if two password different, establish a new error
    if (userInput.password !== userInput.passwordCheck) throw new Error('Password do not match!')
    // confirm whether email das exist, throw error if true
    return User.findOne({ where: { email: userInput.email } })
      .then(user => {
        if (user) throw new Error('Email already exist')
        return bcrypt.hash(userInput.password, 10)
      })
      .then(hash => User.create({
        name: userInput.name,
        email: userInput.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'register account successfully')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // catch error above and call error-handler middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', { user: user.toJSON(), DEFAULT_AVATAR })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const userId = req.params.id
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(userId),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

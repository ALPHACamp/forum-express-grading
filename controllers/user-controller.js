const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
        req.flash('success_messages', 'Sign up SUCCESS.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Logon Success.')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout Success.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")

        let comments = []
        if (user.toJSON().Comments) {
          comments = user.toJSON().Comments.reduce((accu, current) => {
            if (!accu.find(item => item.Restaurant.id === current.Restaurant.id)) {
              accu.push(current)
            }
            return accu
          }, [])
        }
        res.render('users/profile', { user: user.toJSON(), comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // mock-test has no req.user data
    // if (Number(req.params.id) !== req.user.id) throw new Error("Can't edit not your own profile.")
    return User.findByPk(req.params.id, {
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")

        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body

    if (!name) throw new Error('User name is required!')
    if (Number(req.params.id) !== req.user.id) throw new Error("Can't edit not your own profile.")
    const { file } = req

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")

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

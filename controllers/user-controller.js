const bcrypt = require('bcryptjs')
const db = require('../models')

const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match.')

    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) throw new Error('User exists.')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Signed up successfully.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Logged in successfully.')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logged out successfully.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    // if (req.params.id.toString() !== req.user.id.toString()) throw new Error('User id error.')
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        include: Restaurant
      })
    ]).then(([user, comments]) => {
      if (!user) throw new Error("User doesn't exist!")
      return res.render('users/profile', {
        user: user.toJSON(),
        commentCounts: comments.count,
        restaurants: comments.rows.map(r => r.Restaurant.toJSON())
      })
    })
    // return User.findByPk(req.params.id)
    //   .then(user => {
    //     if (!user) throw new Error("User doesn't exist!")
    //     return res.render('users/profile', { user: user.toJSON() })
    //   })
    //   .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // if (req.params.id.toString() !== req.user.id.toString()) throw new Error('User id error.')
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // if (req.params.id.toString() !== req.user.id.toString()) throw new Error('User id error.')
    const { name } = req.body
    if (!name) throw new Error('Username is required.')
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
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

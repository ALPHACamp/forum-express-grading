const bcrypt = require('bcryptjs')

const db = require('../models')
const { User, Comment, Restaurant } = db
const { localFileHelper } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('This email had already signed up!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Signed up completed.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in successfully')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'You\'ve logged out successfully.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { userId: id },
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error('User does not exist!')
        if (!comments) { return res.render('users/profile', { user, commentsCounter: 0 }) }

        const singleComment = comments.rows.map(data => ({
          ...data.Restaurant
        }))
        return res.render('users/profile', { user, commentsCounter: comments.count, singleComment })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User does not exist!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const currentUser = req.user.id
    const id = Number(req.params.id)
    const { name } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(id),
      localFileHelper(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist!')
        if (currentUser !== id) throw new Error('Can not edit other user\'s profile.')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

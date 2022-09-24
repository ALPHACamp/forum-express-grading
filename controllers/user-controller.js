const { User, Comment, Restaurant } = require('../models') // function named User
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
// const id = require('faker/lib/locales/id_ID')
const { Op } = require('sequelize')
// const { Sequelize, QueryTypes } = require('sequelize')
// const sequelize = new Sequelize('mysql://localhost:3306/?user=root&password=password&database=forum')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // (password, salt or salt rounds)
        // then 這邊有 return bcrypt.hash...執行的結果，後面用 then hash 承接，此種方法可以提高閱讀性，避免巢狀層級
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號 請重新登入!')
        res.redirect('/signin')
      })
      .catch(error => next(error)) // 前往 express 內建 error handler middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return Comment.findAll({
          include: [
            { model: Restaurant, attributes: ['name', 'image'] }
          ],
          where: { userId: user.id, text: { [Op.not]: null } },
          group: [['restaurantId', 'text']],
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true,
          attributes: ['text', 'restaurantId']
        })
          .then(comment => {
            res.render('users/profile', { comment, commentLen: comment.length, user })
          })
      })
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        res.render('users/edit', { user })
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const id = Number(req.params.id)
    if (id !== req.user.id) throw new Error('No permission to edit')
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        console.log(filePath)
        req.body.image = filePath || user.image
        return user.update({ ...req.body })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(error => next(error))
  }
  // getUser: async (req, res, next) => {
  //   const [result] = await sequelize.query('SELECT * FROM users WHERE id = ?', {
  //     replacements: [req.params.id],
  //     type: QueryTypes.SELECT
  //   })
  //   console.log(result)
  // }
}

module.exports = userController

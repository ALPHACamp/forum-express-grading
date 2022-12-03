const bcrypt = require('bcryptjs')
// 先取出model中的User(資料表格式?)
const db = require('../models')
const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  // render 註冊的頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 負責實際處理註冊的行為
  signUp: (req, res, next) => {
    // 判斷兩次密碼是否相符
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 判斷email是否已註冊
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 若已有使用者，回傳錯誤訊息
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
        // 在這裡return可丟到下一個then函式
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
  // 登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // 使用者檔案
  // getUser: (req, res, next) => {
  //   const userId = req.params.id
  //   return Promise.all([Comment.findAndCountAll({ where: { userId }, include: Restaurant }),
  //   User.findByPk(userId, { raw: true })])
  //     .then(([comments, userProfile]) => {
  //       const userComments = comments.rows.map(element => { return element.toJSON() })
  //       const count = comments.count
  //       if (!userProfile) throw new Error("User didn't exist!")
  //       res.render('users/profile', { user: getUser(req), userProfile, userComments, count })
  //     })
  //     .catch(err => next(err))
  // },
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([User.findByPk(userId, { raw: true }),
      Comment.findAll({ where: { userId }, include: Restaurant, nest: true, raw: true })])
      .then(([userProfile, comments]) => {
        if (!userProfile) throw new Error("User didn't exist!")
        res.render('users/profile', { user: getUser(req), userProfile, comments })
      })
      .catch(err => next(err))
  },

  // 使用者檔案編輯頁面
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  // 送出編輯結果
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const userId = req.params.id
    if (!name) throw new Error('User name is required!')
    return Promise.all([User.findByPk(userId), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        // user name 重複驗證
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

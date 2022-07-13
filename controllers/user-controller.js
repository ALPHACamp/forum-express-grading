const bcrypt = require('bcryptjs')

const { User, Restaurant, Comment } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => { // 負責 render 註冊的頁面
    res.render('signup')
  },
  signUp: (req, res, next) => { // 處理實際註冊行為
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!') // 當此錯誤發生時，會跳出這個function

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!') // 當此錯誤發生時，會跳出這個function
        return bcrypt.hash(req.body.password, 10) // 這裡用return是為了讓 .then可以保持在同一層
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '已成功註冊帳號，請登入後使用！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // next是指呼叫下一個middleware
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
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.count({
        where: { userId: req.params.id }
      }),
      Comment.findAll({
        where: { userId: req.params.id },
        include: [Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([user, commentNumber, comments]) => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/profile', {
          user,
          commentNumber,
          comments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        // if (user.id !== req.user.id) throw new Error('Have no access to modify')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = Number(req.params.id)
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('User name is required!')
    if (userId !== req.user.id) throw new Error('Have no access to modify')

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, avatarPath]) => {
        if (!user) throw new Error("User didn't exist!")

        return user.update({
          name,
          avatar: avatarPath || user.avatar
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

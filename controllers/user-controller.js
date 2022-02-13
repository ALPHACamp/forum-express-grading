const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db

const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    // 取得錯誤處理當下所發出的 form body
    const body = req.flash('body')
    const bodyParse = body.length ? JSON.parse(body) : ''
    res.render('signup', { ...bodyParse })
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    // 如果兩次輸入的密碼不同，丟出 Error
    if (password !== passwordCheck) throw new Error('Passwords do not match!')

    // 確認使用者是否註冊
    User.findOne({ where: { email } })
      .then(user => {
        // 已註冊就拋出 Error
        if (user) throw new Error('Email already exists!')
        // 正常註冊程序
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    // 取得錯誤處理當下所發出的 form body
    const body = req.flash('body')
    const bodyParse = body.length ? JSON.parse(body) : ''
    res.render('signin', { ...bodyParse })
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
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        //  Whether user is self
        user.self = user.id === getUser(req).id
        res.render('users/profile', { user })
      })
      .catch(err => next(err))
  }
}

module.exports = userController

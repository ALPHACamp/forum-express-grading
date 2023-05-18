const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  // 使用者註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  // 使用者註冊功能
  signUp: async (req, res, next) => {
    try {
      // 若前後密碼不一致
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      const findUser = await User.findOne({ where: { email: req.body.email } })
      // 若Email已註冊
      if (findUser) {
        throw new Error('Email already exists!')
      }

      const passwordHash = await bcrypt.hash(req.body.password, 12)
      const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
      })
      if (createUser) {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      }
    } catch (err) {
      next(err)
    }
  },
  // 使用者登入頁面
  signInPage: (req, res) => {
    return res.render('signin')
  },
  // 使用者登入功能
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    // // 判斷是否具備管理者權限：是→後台首頁、否→前台首頁
    // if (req.user.dataValues.isAdmin) {
    //   res.redirect('/admin/restaurants')
    // } else {
    //   res.redirect('/restaurants')
    // }
    return res.redirect('/restaurants')
  },
  // 使用者登出功能
  signout: (req, res) => {
    req.logout()
    req.flash('success_messages', '登出成功！')
    return res.redirect('/signin')
  }
}

module.exports = userController

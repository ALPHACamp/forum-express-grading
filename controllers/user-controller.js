const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
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
    const currentUser = getUser(req)
    const getUserId = Number(req.params.id)
    const editPermission = (getUserId === currentUser.id)
    return Promise.all([
      User.findByPk(getUserId, {
        raw: true
      }),
      Comment.findAndCountAll({
        where: { user_id: getUserId },
        include: [Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([user, { count, rows }]) => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/profile', { user, editPermission, count, comments: rows })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const getUserId = Number(req.params.id)
    const currentUser = getUser(req)
    const editPermission = (getUserId === currentUser.id)
    if (!editPermission) {
      req.flash('error_messages', '無法編輯他人的使用者資料!')
      return res.redirect(`/users/${currentUser.id}`)
    }
    return User.findByPk(getUserId, { raw: true })
      .then(user => {
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    if (req.user.id !== Number(getUser(req).id)) {
      req.flash('error_messages', '無法編輯他人的使用者資料!')
      res.redirect('/restaurants')
    }
    return Promise.all([ // 非同步處理
      User.findByPk(req.params.id), // 去資料庫查有沒有這個使用者
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([user, filepath]) => {
        if (!user) throw new Error('user did not exists!')
        return user.update({
          name, image: filepath || user.image
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

const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {

  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', {
          user: user.toJSON()
        })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        console.log(user)
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file

    const id = req.params.id

    Promise.all([ // 非同步處理
      User.findByPk(req.params.id), // 去資料庫查
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([user, filePath]) => { // 以上兩樣事都做完以後
        console.log('user')
        if (!user) throw new Error("User didn't exist!")
        return user.update({ // 修改這筆資料
          name,
          image: filePath || user.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },

  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
        // 前面加 return
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
      .catch(err => next(err))
  }, // 新增以下程式碼
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout(function (err) {
      if (err) { return next(err) }
      res.redirect('/')
    })
  }
}
module.exports = userController

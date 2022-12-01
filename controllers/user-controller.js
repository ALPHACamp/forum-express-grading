const bcrypt = require('bcryptjs') // 載入 bcrypt
const { imgurFileHandler } = require('../helpers/file-helpers')
const db = require('../models')
const { User, Restaurant, Comment } = db

const userController = {
  // sign up
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // hash() 函式接受兩個參數：第一個參數：一個需要被加密的字串/第二個參數：可以指定要加的鹽或複雜度係數
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({
      where: { email: req.body.email }
    })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
        // 前面加 return，讓這個 Promise resolve 的值可以傳到下一個 .then 裡面，下一個 .then 裡面的參數 hash 就會是加密過後的密碼
      })
      // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  // sign in
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '你已成功登入!')
    res.redirect('/restaurants')
  },

  // logout
  logout: (req, res) => {
    req.flash('success_messages', '你已成功登出!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id,
      {
        nest: true,
        // 拿到關聯的comment，再拿到comment關聯的Rest
        include: [
          { model: Comment, include: Restaurant }
        ]
      })
      .then(user => {
        if (!user) throw new Error('這位使用者不存在!')
        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('這位使用者不存在!')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const userId = req.params.id
    const file = req.file
    if (!name) throw new Error('User name is required!')
    if (req.user.id !== Number(userId)) throw new Error('不能更改其他使用者的資料!')
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('這位使用者不存在!')
        return user.update({
          name,
          image: filePath || user.image
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

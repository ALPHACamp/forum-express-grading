/* eslint-disable indent */
const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
// const { tr } = require('faker/lib/locales')
const { User, Comment, Restaurant } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => { // 修改這裡
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
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      raw: false,
      nest: true,
      include: [
        { model: Comment, include: User }
      ]
    })
      .then(async user => {
        if (!user) throw new Error("User didn't exist!")

        let commentedRestaurantIds = []
        if (user.Comments) {
          commentedRestaurantIds = user.Comments.map(comment => comment.restaurantId)
        }

        let commentedRestaurants = []
        if (commentedRestaurantIds.length > 0) {
          commentedRestaurants = await Restaurant.findAll({
            where: { id: commentedRestaurantIds },
            raw: true
          })
        }

        await res.render('users/profile', {
          user: user.toJSON(),
          commentedRestaurants,
          commentCounts: commentedRestaurantIds.length
        })
      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
  },
  putUser: (req, res) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req // 把檔案取出來
    return Promise.all([ // 非同步處理
      User.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([user, filePath]) => { // 以上兩樣事都做完以後
        if (!user) throw new Error("User didn't exist!")
        return user.update({ // 修改這筆資料
          name,
          image: filePath || user.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
  }
}
module.exports = userController

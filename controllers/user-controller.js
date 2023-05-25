const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來
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
  getUser: (req, res) => {
    const loginId = getUser(req).id
    const id = Number(req.params.id)
    const where = {}
    where.userId = id
    return Promise.all([ // 非同步處理
      User.findByPk(req.params.id, {
        raw: true,
        nest: true
      }),
      Comment.findAndCountAll({
        include: [
          Restaurant
        ],
        where: where,
        raw: true,
        nest: true
      })
    ])
      .then(([user, comment]) => {
        const data = comment.rows.map(r => ({
          ...r
        }))
        const count = comment.count
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/profile', {
          user,
          comment: data,
          count,
          loginId
        })
      })
  },
  editUser: (req, res) => {
    const loginId = getUser(req).id
    const id = Number(req.params.id)
    if (loginId !== id) {
      req.flash('error_messages', '禁止修改他人資料')
      return res.redirect('back')
    }
    return User.findByPk(id, {
      raw: true, // 讓拿到的資料是最簡單的javascript資料
      nest: true // 讓拿到的資料是比較簡單的. ex:restaurant.category.id
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
  },
  putUser: (req, res, next) => {
    const loginId = getUser(req).id
    const { name } = req.body // 從 req.body 拿出表單裡的資料
    const id = Number(req.params.id)
    if (loginId !== id) {
      return req.flash('error_messages', '禁止修改他人資料')
    }
    if (!name) throw new Error('User name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
    return Promise.all([ // 非同步處理
      User.findByPk(id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([users, filePath]) => {
        if (!users) throw new Error("Users didn't exist!")
        users.update({
          name,
          image: filePath || users.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
        req.flash('success_messages', '使用者資料編輯成功') // 在畫面顯示成功提示
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

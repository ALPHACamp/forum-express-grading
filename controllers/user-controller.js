// 引入模組
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

// 引入file-helpers
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  // 渲染signup頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    // 若password與passwordCheck不一致，建立一個Error物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 確認資料庫是否有一樣的email，若有建立一個Error物件並拋出
        if (user) throw new Error('Email already exists!')

        // 若無建立密碼雜湊，並將資料新增至資料庫，最後重新導向signin頁面
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號') // 顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  // 渲染signin頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  // 登出路由
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  // 瀏覽profile
  getUser: (req, res, next) => {
    // 取得動態路由id
    const id = Number(req.params.id)

    // 查詢動態路由id的user資料
    return User.findByPk(id, { raw: true })
      .then(user => {
        // 判斷是否有該資料，否回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")

        // 渲染users/profile頁面，並帶入參數
        return res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },

  // 編輯profile頁面
  editUser: (req, res, next) => {
    // 取得登入者id
    // const userId = req.user.id
    // 取得動態路由id
    const id = Number(req.params.id)

    // 判斷前往路由id是否與userId一致，否回傳錯誤訊息
    // if (id !== userId) throw new Error('只能瀏覽自已的Profile')

    // 查詢動態路由id的user資料
    return User.findByPk(id, { raw: true })
      .then(user => {
        // 判斷是否有該資料，否回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")

        // 渲染users/profile頁面，並帶入參數
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  // 更新profile
  putUser: (req, res, next) => {
    console.log('name', req)
    // 取得表單資料
    const { name } = req.body
    // 取得在middleware/multer處理過放在req.file裡的圖片資料
    const { file } = req
    // 取得動態路由id
    const id = req.params.id

    // 判斷name是否有值，無回傳錯誤訊息
    if (!name) throw new Error('User name is required')

    return Promise.all([
      User.findByPk(id), // 查詢動態路由id的user資料
      imgurFileHandler(file) // 呼叫localFileHandler處理圖片檔案
    ])
      .then(([user, filePath]) => {
        // 判斷user是否有資料，無回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")

        // 更新資料庫資料
        return user.update({
          name,
          image: filePath || user.image // 如果filePath有值就更新成filePath， 若沒有值維特更新前的image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功') // 回傳成功訊息
        res.redirect(`/users/${id}`) // 重新導向該使用者profile頁面
      })
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = userController

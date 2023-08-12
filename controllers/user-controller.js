const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const authHelper = require('../helpers/auth-helpers')
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
    const paramsUserId = Number(req.params.id)
    return Promise.all([
      User.findByPk(paramsUserId, { raw: true }),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        raw: true,
        nest: true,
        include: Restaurant
      })
    ])
      .then(([user, comments]) => {
        res.render('users/profile', {
          user,
          count: comments.count,
          comments: comments.rows
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // 取得passport幫我們放入的user，也就是當前登入的登入者id
    const reqUser = authHelper.getUser(req).id
    // 取得路由中的動態路由的字串，並轉換成數字，此為編輯者id
    const paramsUserId = Number(req.params.id)
    // 如果登入者與編輯者身分不同，直接丟出去
    if (reqUser !== paramsUserId) {
      req.flash('error_messages', '無法編輯他人的使用者資料！')
      return res.redirect(`/users/${paramsUserId}`)
    }
    return User.findByPk(paramsUserId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    // 取得passport幫我們放入的user，也就是當前登入的登入者id
    const reqUser = authHelper.getUser(req).id
    // 取得路由中的動態路由的字串，並轉換成數字，此為編輯者id
    const paramsUserId = Number(req.params.id)
    // 如果沒有name
    if (!name) throw new Error('Name is required!')
    // 如果登入者與編輯者身分不同，直接丟出去
    if (reqUser !== paramsUserId) {
      req.flash('error_messages', '無法編輯他人的使用者資料！')
      return res.redirect(`/users/${paramsUserId}`)
    }
    return Promise.all([
      User.findByPk(paramsUserId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({
          name: name || user.name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${paramsUserId}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController

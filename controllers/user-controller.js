const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Restaurant, Comment, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  // 註冊
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match.')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists.')
        return bcrypt.hash(req.body.password, 10) // 加讓return傳給下個.then使用
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message') // 上面都沒錯誤就傳成功flash
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，next呼叫專門做錯誤處理的 middleware
  },
  // 登入
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出
  logout: (req, res) => {
    req.logout() // 把 user id 對應的 session 清除掉
    req.flash('success_messages', '登出成功！')
    res.redirect('/signin')
  },
  // Profile page
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User does not exist.')
        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，next呼叫專門做錯誤處理的 middleware
  },
  // Profile edit page
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('User does not exist.')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，next呼叫專門做錯誤處理的 middleware
  },
  // put edit
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist.')
        return user.update({ // sequelize 編輯資料語法
          name,
          image: filePath || user.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，next呼叫專門做錯誤處理的 middleware
  },
  // Favorite 新增
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params // 網址抓取
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ // 抓特定條件data
        where: { // 帶入條件
          userId: req.user.id, // 當前user id
          restaurantId // 當前restaurant id
        }
      })
    ])
      .then(([restaurant, favorite]) => { // Promise.all依序傳入變數
        if (!restaurant) throw new Error("Restaurant didn't exist!") // 防呆
        if (favorite) throw new Error('You have favorited this restaurant!') // 防重複加入

        return Favorite.create({ // Favorite建立資料
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back')) // 導回上一頁
      .catch(err => next(err))
  },
  // Favorite 刪除
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant") // 防止刪除無效目標

        return favorite.destroy() // 從資料庫刪除資料
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController

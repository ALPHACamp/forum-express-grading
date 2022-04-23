const bcrypt = require('bcryptjs') // 載入 bcrypt
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite } = require('../models')
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
  signInPage: async function (req, res) {
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
  getUser: async function (req, res, next) {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true
      })
      const restaurantList = await Comment.findAll({
        where: {
          userId: req.params.id
        },
        raw: true,
        nest: true,
        include: [Restaurant]
      })
      const restaurantIdList = Array.from(new Set(restaurantList.map(item =>
        item.Restaurant.id
      )))
      const restaurant = await Restaurant.findAll({
        where: {
          id: restaurantIdList
        },
        raw: true
      })
      res.render('users/profile', { user, restaurant })
    } catch (err) {
      next(err)
    }
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: async function (req, res, next) {
    const { name } = req.body
    const { file } = req
    const user = await User.findByPk(req.params.id)
    const filePath = await imgurFileHandler(file)
    if (!user) throw new Error("User didn't exist!")
    await user.update({
      name,
      image: filePath || user.image
    })
    req.flash('success_messages', '使用者資料編輯成功')
    res.redirect(`/users/${req.params.id}`)
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

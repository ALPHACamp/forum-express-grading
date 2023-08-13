const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const { Restaurant, Comment, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const authHelper = require('../helpers/auth-helpers')

const userController = {
  // render sign up page
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // sign up
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  // render sign in page
  signInPage: (req, res) => {
    res.render('signin')
  },
  // sign in
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // logout
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // render profile
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(req.params.id, {
        raw: true,
        nest: true
      }),
      Comment.findAll(
        {
          where: { user_id: userId },
          raw: true,
          nest: true,
          include: [Restaurant]
        })
    ])
      .then(([user, comments]) => {
        const commentAmount = comments.length
        return res.render('users/profile', { user, comments, commentAmount })
      })
      .catch(err => next(err))
  },
  // render edit page
  editUser: (req, res, next) => {
    if (authHelper.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', 'Read only, not allowed to change.')
      res.redirect(`/users/${req.params.id}`)
    }

    return User.findByPk(req.params.id, { raw: true })
      .then(user => res.render('users/edit', { user }))
      .catch(err => next(err))
  },
  // save edit
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!name) throw new Error('姓名是必要欄位')
        return user.update({
          name,
          avatar: filePath || user.avatar
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  // 加入最愛
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
      .then(() => {
        req.flash('success_messages', '已將餐廳加入你的 Favorite list!')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  // 移除最愛
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
      .then(() => {
        res.redirect('back')
        req.flash('success_messages', '已將餐廳從你的 Favorite list 中移除!')
      })
      .catch(err => next(err))
  }
}

module.exports = userController

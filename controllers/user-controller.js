const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment, Favorite } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match')

    // 確認資料裡面沒有一樣的 email，若有就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({ // 上面狀況都沒發生，就把資料寫入資料庫
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
    res.redirect('signin')
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      Comment.findAll({
        where: { userId: id }, // 找到留言屬於此user的
        attributes: ['restaurantId'], // 指定回傳欄位
        group: 'restaurantId', // 把他以 restaurantId 分組
        include: Restaurant, // 把關聯資料包含進來
        nest: true,
        raw: true
      }),
      User.findByPk(id, { raw: true })
    ])
      .then(([comments, user]) => {
        if (!user) throw new Error("User is didn't exist!")
        res.render('users/profile', {
          user,
          comments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User is didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('name is required!')
    const { file } = req // 把檔案取出，也可寫成const file = req.file

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("user didm't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
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
      .then(() => {
        req.flash('success_messages', '成功加入最愛')
        res.redirect('back')
      })
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
      .then(() => {
        req.flash('success_messages', '成功移除最愛')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = userController

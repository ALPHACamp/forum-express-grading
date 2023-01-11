const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Like } = db
const { imgurFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來，處理圖片

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 有輸入值為空白的情況
    if (!name.trim() || !email || !password || !passwordCheck) {
      throw new Error('All fields are required, cannot be blank!')
    }
    // 兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (password !== passwordCheck) {
      throw new Error('Password check is not match with password!')
    }
    User.findOne({ where: { email } })
      .then(user => {
        // Email已經註冊過，就建立一個 Error 物件並拋出
        if (user) {
          throw new Error('Email is already registered!')
        }
        // 都沒錯誤則進行雜湊（必須return，then才會接到）
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_messages', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err, req)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/restaurants')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      User.findByPk(id, { raw: true }),
      Comment.findAndCountAll({
        where: { userId: id },
        include: Restaurant,
        raw: true,
        nest: true
      })
    ])
      .then(([user, commits]) => {
        if (!user) throw new Error('User is not existed!')
        res.render('users/profile', { user, commits })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('User is not existed!')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const { file } = req
    const { name } = req.body
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User is not existed!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: { restaurantId, userId }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        if (like) throw new Error('Already liked!')
        return Like.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Like.findOne({
      where: { restaurantId, userId }
    })
      .then(like => {
        if (!like) throw new Error('Have not liked!')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController

const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Restaurant, User, Comment } = require('../models')

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    // 驗證：兩次密碼不同就回傳 Error
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Password do not match')
    }
    // 驗證：這個email還沒有被註冊，已經有的話回傳 Error
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
        res.redirect('/signin')
      })
      .catch(err => {
        next(err)
      }) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (req.flash) {
      req.flash('success_messages', 'Sign in successfully.')
    }
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully.')
    req.logout()
    res.redirect('/signin')
  },

  // Profile
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: {
        model: Comment,
        include: Restaurant
      },
      order: [
        [Comment, 'id', 'DESC']
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        return res.render('users/profile', { user: user.toJSON() })
        // 使用 多層查詢不能使用 raw:true, 需要在最後使用 user.toJSON()
      })
      .catch(err => next(err))
  },

  // Edit Profile
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const { name } = req.body
    // 驗證名字
    if (!name) throw new Error('Name can not be empty!')

    // 找User + 上傳照片到imgur (取得url)
    // 記得要在 router 使用 multer middleware 來取得 req.file
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('Can not find user to edit!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

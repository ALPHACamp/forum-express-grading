const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) throw new Error('Passwords do not match')
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already Exists')

      const salt = await bcrypt.genSalt(5)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, email, password: hash })
      req.flash('success_messages', '成功註冊帳號')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
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
    return User.findByPk(req.params.id, {
      include: [{
        model: Comment, include: Restaurant
      }]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        const userData = user.toJSON()
        // 找出評論過的不重複餐廳
        userData.commentedRestaurants = userData.Comments && userData.Comments.reduce((acc, comment) => {
          if (!acc.some(restaurant => restaurant.id === comment.restaurantId)) acc.push(comment.Restaurant)
          return acc
        }, [])
        return res.render('users/profile', {
          user: getUser(req),
          userData
        })
      })
      .catch(next)
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist")
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(next)
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const { id } = req.params
    if (req.user.id !== Number(id)) throw new Error('不要偷改別人資料！！！')
    if (!name.trim()) throw new Error('Name is required!')
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([userData, filePath]) => {
        if (!userData) throw new Error("User didn't exist")
        return userData.update({
          name,
          image: filePath || userData.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(next)
  }
}

module.exports = userController

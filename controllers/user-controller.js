const bcrypt = require('bcryptjs')
const db = require('../models/index')
const { User, Comment, Restaurant } = require('../models')

const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      return res.render('signup')
    } catch (err) {
      next(err)
    }
  },
  signUP: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (!name || !email || !password || !passwordCheck) throw new Error('所有欄位都需填寫！')

      if (password !== passwordCheck) throw new Error('兩次密碼不相符！')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('該電子郵件已經註冊過！')

      const hash = bcrypt.hashSync(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })

      req.flash('success_messages', '帳號成功註冊！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: async (req, res, next) => {
    try {
      return res.render('signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      return res.redirect('/restaurants')
    } catch (err) {
      next(err)
    }
  },
  logOut: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登出！')
      req.logout()
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [rawUser, comments] = await Promise.all([
        User.findByPk(userId),
        Comment.findAll({
          where: { userId },
          attributes: [
            'restaurant_id',
            [
              db.sequelize.fn('count', db.sequelize.col('restaurant_id')),
              'comments'
            ]
          ],
          include: [Restaurant],
          group: ['restaurant_id'],
          raw: true,
          nest: true
        })
      ])

      if (!rawUser) throw new Error('該使用者不存在！')

      const totalComments = comments.reduce((accumulator, curValue) => {
        return accumulator + curValue.comments
      }, 0)

      const user = { ...rawUser.toJSON() }

      return res.render('users/profile', { user, comments, totalComments })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const id = Number(req.params.id)

      if (id !== userId) {
        req.flash('error_messages', '無法編輯除了自己以外的使用者！')
        return res.redirect(`/users/${userId}`)
      }

      const user = await User.findByPk(id, { raw: true })
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!name) throw new Error('User name is required!')

      const { file } = req
      const [filePath, user] = await Promise.all([
        imgurFileHandler(file),
        User.findByPk(id)
      ])

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

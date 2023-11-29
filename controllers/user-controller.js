const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 01、如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }

    // 02、確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash =>
        User.create({
          // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
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
    // 在路由使用middleware來驗證登入
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
      include: [{ model: Comment, include: [Restaurant] }]
    })
      .then(user => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        // 使user.Comments的值不為undefined
        user.dataValues.commentsCount = user.Comments ? user.Comments.length : 0
        const userJson = user.toJSON()
        res.render('users/profile', { user: userJson })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  // 使用async/await，確保所有操作都完成
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Name為必填欄位')

      const { file } = req

      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('此user不存在')

      const filePath = await imgurFileHandler(file)

      await user.update({
        name,
        image: filePath || user.image
      })

      const userJson = user.toJSON()
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${userJson.id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

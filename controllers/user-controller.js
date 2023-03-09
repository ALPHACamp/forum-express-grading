const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
      // 在 express 裡，若 next() 有參數，就會認為要傳錯誤訊息，因此會轉到處理錯誤用的 middleware
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
    req.logout() // 這個 .logout() 是 passport 提供的 Fn. --> 把 id 對應的 session 清掉 (清掉即登出)
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    // return Promise.all([
    //   User.findByPk(req.params.id, { raw: true }),
    //   Comment.findAndCountAll({
    //     where: { userId: req.params.id },
    //     raw: true,
    //     nest: true,
    //     include: Restaurant
    //   })
    // ])
    //   .then(([user, comments]) => {
    //     return res.render('users/profile', { user, comments })
    //   })
    //   .catch(err => next(err))
    // 我認為下面方法更簡潔，但 test 檔不給過，只能改成上面
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        // user = user.toJSON()
        // user.commentCounts = user.Comments.length // test 檔案不給過，不能用
        return res.render('users/profile', { user: user.toJSON() })
      })
  },
  editUser: (req, res, next) => {
    // const { name, image } = req.body
    // res.render('users/edit')
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({ name, image: filePath || user.image }) // image 路徑，更新或是沿用舊值
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

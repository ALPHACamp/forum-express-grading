const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
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
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Account successfully created.')
        res.redirect('signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) throw new Error('Impossibe!')
        return user.update({ loggedIn: 1 })
      })
      .then(user => {
        req.flash('success_messages', 'Login successfully.')
        res.redirect('/restaurants')
      })
      .catch(err => next(err))
  },
  logout: (req, res, next) => {
    return User.findByPk(req.user.id)
      .then(user => {
        if (!user) throw new Error('Impossibe!')
        return user.update({ loggedIn: 0 })
      })
      .then(user => {
        req.flash('success_messages', 'Logout successfully.')
        req.logout()
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const paramsId = parseInt(req.params.id)
    return User.findByPk(paramsId)
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
    // 上面這組程式碼可以使用也能通過測試，可是如果在瀏覽器直接輸入別的params id，
    // header的email就會變成該profile的email，所以我原本用的是下面註解掉的程式碼，
    // 可是目前的測試檔mock req內容為{ params: { id: 1 }, flash: [Function (anonymous)] }
    // 所以以下程式碼在開發環境可以使用，在測試環境就會跳錯找不到user.id。
    // return Promise.all([
    //   User.findByPk(req.params.id),
    //   User.findByPk(req.user.id)
    // ])
    //   .then(([guestUser, hostUser]) => {
    //     if (!hostUser) throw new Error('User did not exist!')
    //     res.render('users/profile', {
    //       user: hostUser.toJSON(),
    //       guest: guestUser.toJSON()
    //     })
    //   })
    //   .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const paramsId = parseInt(req.params.id)
    return User.findByPk(paramsId)
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    console.log(req)
    const { name } = req.body
    const { file } = req
    const userId = req.user.id
    const paramsId = parseInt(req.params.id)
    if (userId !== paramsId) throw new Error('This is not your profile, you are not allowed to edit.')
    if (!name) throw new Error('User name is required!')
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User did not exist!')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

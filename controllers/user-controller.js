const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) throw Error('Passwords do not match!')

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
      .catch(err => next(err))
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
  getUser: (req, res) => {
    // console.log(req.params.id)
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!'")
        user = user.dataValues
        // console.log(user)
        return res.render('users/profile', user)
      })
      .catch(err => next(err))
  },
  editUser: (req, res) => {
    // console.log(req.params.id)
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!'")
        user = user.dataValues
        // console.log(user)
        return res.render('users/edit-user', user)
      })
      .catch(err => next(err))
  },
  putUser: (req, res) => {
  //   const { name, id } = req.body
  //   if (!name) throw new Error('Restaurant name is required!')
  //   const { file } = req
  //   Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
  //     .then((user) => {
  //       if (!user) throw new Error("Restaurant didn't exist!")
  //       return user.update({
  //         id,
  //       name})
  //     })
  //     .then(() => {
  //       req.flash('success_messages', 'your information was successfully to update')
  //       res.redirect('/')
  //       res.redirect(`users/${id}`)
  //     })
  //     .catch(err => console.log(err))
  // }
    const { name, id } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("Restaurant didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        }, { where: { id: id } })
      })
      .then(user => {
        console.log(user)
        req.flash('success_messages', 'your information was successfully to update')
        res.redirect(`/users/${user.dataValues.id}`)
      })
      .catch(err => console.log(err))
  }
}
module.exports = userController

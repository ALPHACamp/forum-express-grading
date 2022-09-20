const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

exports.signUpPage = (req, res, next) => {
  res.render('signup')
}

exports.signUp = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords not match!')

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user) throw new Error('Email exists already')

    const hash = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    })
    req.flash('success_messages', '成功註冊帳戶！')
    return res.redirect('/signin')
  } catch (err) {
    next(err)
  }
}

exports.signInPage = (req, res, next) => {
  res.render('signin')
}

exports.signIn = (req, res, next) => {
  req.flash('success_messages', '成功登入')
  res.redirect('/restaurants')
}

exports.logout = (req, res, next) => {
  req.flash('success_messages', '成功登出')
  req.logout()
  res.redirect('/signin')
}

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId)
    if (!user) throw new Error('User not found!')
    console.log(user)
    return res.render('user', { viewUser: user.toJSON() })
  } catch (err) {
    next(err)
  }
}

exports.editUser = async (req, res, next) => {
  return res.render('edit-user')
}

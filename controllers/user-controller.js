const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

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
    return res.render('/users/profile', { viewUser: user.toJSON() })
  } catch (err) {
    next(err)
  }
}

exports.editUser = (req, res, next) => {
  return res.render('edit-user')
}

exports.putUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId)
    if (!user) throw new Error('User not found!')

    const { name } = req.body
    if (!name) throw new Error('名稱為必填欄位')

    const { file } = req
    const filePath = await imgurFileHandler(file)
    await user.update({
      name: req.body.name,
      image: filePath || null
    })
    return res.redirect('/users/' + userId)
  } catch (err) {
    next(err)
  }
}

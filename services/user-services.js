const db = require('../models')
const bcrypt = require('bcryptjs')
const { User } = db

const userServices = {
  signUp: (req, cb) => {
    // 確認密碼與驗證密碼是否相同
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email
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
      .then(user => cb(null, { user: user.toJSON() }))
      .catch(err => cb(err))
  }
}

module.exports = userServices

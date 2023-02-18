const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      res.render('signup', { name, email })
      return console.log('Confirm password is not correct!')
    }
    return User.findOrCreate({
      where: { email },
      defaults: { name, email, password: bcrypt.hashSync(password, 10) }
    })
      .then(([user, created]) => {
        if (!created) return console.log('Email is already existed!')
        req.flash('success_messages', 'Sign up successfully!')
        res.redirect('/signin')
      })
      .catch(err => console.log(err))
  }
}

module.exports = userController

const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

exports.signUpPage = (req, res, next) => {
  res.render('signup')
}

exports.signUp = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    })
    return res.redirect('/signin')
  } catch (err) {
    console.log(err)
  }
}
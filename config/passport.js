const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, cb) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    const match = await bcrypt.compare(password, user.password)
    if (match) return cb(null, user)
    return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
  } catch (err) {
    return cb(err, false)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, { include: [{ model: Restaurant, as: 'FavoritedRestaurants' }] })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
})

module.exports = passport
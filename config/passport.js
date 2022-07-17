const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// set LocalStrategy
const customFields = {
  usernameField: 'email', // make default verify username to email
  passwordField: 'password', // make default verify password to password
  passReqToCallback: true
}
const verifyCallback = async (req, email, password, cb) => {
  const user = await User.findOne({ where: { email } })
  if (!user) return cb(null, false, req.flash('error_messages', '帳號輸入錯誤！'))
  const res = await bcrypt.compare(password, user.password)
  if (!res) return cb(null, false, req.flash('error_messages', '密碼輸入錯誤！'))

  return cb(null, user)
}
const localStrategy = new LocalStrategy(customFields, verifyCallback)
passport.use(localStrategy)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport

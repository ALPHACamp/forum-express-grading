const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// Strategies
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, cb) => {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', 'Account or Password error!'))
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(null, false, req.flash('error_messages', 'Account or Password error!'))
    return cb(null, user)
  }
))
// Serialize and deserialize
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    cb(err)
  }
})

module.exports = passport

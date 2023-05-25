const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => { // cb 意即done
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) cb(null, false, req.flash('error_messages', 'Email or password incorrect.'))

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) return cb(null, false, req.flash('error_messages', 'Email or password incorrect.'))

    return cb(null, user)
  } catch (e) {
    cb(e)
  }
})
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Restaurant, as: 'FavoritedRestaurants' }]
    })
    return cb(null, user.toJSON())
  } catch (e) {
    cb(e)
  }
})

module.exports = passport

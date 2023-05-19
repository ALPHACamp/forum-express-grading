const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => { // cb 意即done
  try {
    const findUser = await User.findOne({ where: { email } })
    if (!findUser) {
      return cb(null, false, req.flash('error_messages', 'Email or password incorrect.'))
    } else {
      const passwordCompare = await bcrypt.compare(password, findUser.password)
      if (!passwordCompare) return cb(null, false, req.flash('error_messages', 'Email or password incorrect.'))
      return cb(null, findUser)
    }
  } catch (e) {
    console.error(e)
  }
})
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  const findUser = await User.findByPk(id)
  return cb(null, findUser)
})

module.exports = passport

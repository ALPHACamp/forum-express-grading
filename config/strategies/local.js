const LocalStrategy = require('passport-local')
const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    // use email to check user exist
    User.findOne({ where: { email } }).then(user => {
      if (!user) return done(null, false, req.flash('error_messages', 'Email is not registered!'))
      // compare password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) return done(null, false, req.flash('error_messages', 'Email or Password incorrect'))
        // authenticated, return user
        return done(null, user)
      })
    })
  }))
}

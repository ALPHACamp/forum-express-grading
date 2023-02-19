const passport = require('passport')

const authController = {
  // fb 登入動作，使用剛剛撰寫的 facebook 驗證策略
  facebookSignin: passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }),
  facebookCallback: [passport.authenticate('facebook', {
    failureRedirect: '/signin',
    successRedirect: '/#'
  })]
}

module.exports = authController

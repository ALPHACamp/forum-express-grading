const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

module.exports = app => {
  // - initialize and session
  app.use(passport.initialize())
  app.use(passport.session())

  // - LocalStrategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const foundUser = await User.findOne({ where: { email } })
          if (!foundUser) {
            return done(
              null,
              false,
              req.flash('error_messages', '信箱或密碼輸入錯誤!')
            )
          }
          // - 用戶存在
          const isMatch = await bcrypt.compare(password, foundUser.password)
          if (!isMatch) {
            return done(
              null,
              false,
              req.flash('error_messages', '信箱或密碼輸入錯誤!')
            )
          }
          return done(null, foundUser)
        } catch (error) {
          return done(error, false)
        }
      }
    )
  )

  // - serialization & deserialization
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const foundUser = await User.findByPk(id, {
        // -撈取user資料時一併透過別名獲取加入最愛的餐廳
        include: [{ model: Restaurant, as: 'FavoritedRestaurants' }]
      })

      if (!foundUser) return done(null, false)

      return done(null, foundUser.toJSON())
    } catch (error) {
      return done(error, null)
    }
  })
}

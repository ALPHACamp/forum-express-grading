const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async function (req, email, password, done) {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return done(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      }
      const passwordCorrect = await bcrypt.compare(password, user.password)
      if (!passwordCorrect) {
        return done(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      }
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  }
)

passport.use(localStrategy)

passport.serializeUser(function (user, done) {
  try {
    return done(null, user.id)
  } catch (error) {
    return done(error, false)
  }
})

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id,
      {
        include: { model: Restaurant, as: 'FavoritedRestaurants' }
        // 取出Favorited餐廳後提供前台渲染favorite按紐
        // as 需要與User 中的as一樣
      })
    return done(null, user.toJSON())
  } catch (error) {
    return done(error, false)
  }
})
module.exports = passport

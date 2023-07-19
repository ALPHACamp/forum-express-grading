const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db // 用解構付值把db內的User model拿出來
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match!') // throw error時和return一樣會直接停下來
      }

      // 用email註冊帳號 或尋找
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          name,
          email,
          password: hash
        }
      })

      // 如果已存在user就抱錯
      if (created) {
        throw new Error('Email already exists!') // throw error時和return一樣會直接停下來
      }

      req.flash('success_messages', '成功註冊帳號！')// 如果成功（上面都跑完）才回傳訊息
      res.redirect('/signin')
    } catch (error) {
      next(error) // middleware如果next內包東西，next會認為提供的東西是error message，會走錯誤路線
    }
  }
}
module.exports = { userController }

const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUP: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) throw new Error('兩次密碼不相符！')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('該電子郵件已經註冊過！')

      const hash = bcrypt.hashSync(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })

      req.flash('success_messages', '帳號成功註冊！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

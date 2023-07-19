const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db // 用解構付值把db內的User model拿出來
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
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
    res.redirect('/signin')
  }
}
module.exports = { userController }

const jwt = require('jsonwebtoken')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 將 req.user 改成 userData
      res.json({
        status: 'success',
        data: {
          token,
          user: userData // 將 req.user 改成 userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

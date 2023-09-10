const jwt = require('jsonwebtoken')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON() // 新增這一行
      delete userData.password // 新增這裡，刪除密碼
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
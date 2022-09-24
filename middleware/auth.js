// middlewares
// authenticated：用 req.isAuthenticate() 確定能不能去除了後台以外的路徑
// T -> 成功登入，可以通行至其他路徑
// F -> 如果沒有登入導到登入頁面

// authenticatedAdmin：用 req.isAuthenticate() 確定能不能去後台
// T -> 成功登入 && req.user.isAdmin 是 T 表示登入狀態且是管理者身分，因此可以前往 admin
// F -> 沒有登入導到登入頁面

const helpers = require('../helpers/auth-helpers') // req.isAuthenticated(T or F)、req.user
const authenticated = (req, res, next) => {
  // 假設 req.isAuthenticated 是 T，就可以前往下一個路由
  if (helpers.ensureAuthenticated(req)) return next() // 停止往下走
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()

    res.redirect('/') // 從 admin 改成 user 會轉跳到這邊
  }
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 已登入，繼續
  if (helpers.ensureAuthenticated(req)) return next()
  // 未登入，返回登入頁面
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  // 已登入
  if (helpers.ensureAuthenticated(req)) {
    // 管理員，繼續
    if (helpers.getUser(req).isAdmin) return next()
    // 一般用戶，返回登入頁面
    return res.redirect('/')
  }
  // 未登入，返回登入頁面
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

const helpers = require('../helpers/auth-helpers')

// 驗證登入狀態
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    // 有登入=>往下走
    return next()
  }
  // 未登入=>丟回登入頁
  res.redirect('/signin')
}

// 驗證管理員身份
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    // 有登入且為管理員=>往下走
    if (helpers.getUser(req).isAdmin) return next()
    // 有登入但非管理員=>丟回首頁
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  // 使用者是否登入
  if (helpers.ensureAuthenticated(req)) {
    // 已登入 -> 往下走
    return next()
  }
  // 沒登入 -> 回登入頁面
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  // 使用者是否登入
  if (helpers.ensureAuthenticated(req)) {
    // 已登入 -> 是否為 admin   // 是 admin -> 往下走
    if (helpers.getUser(req).isAdmin) return next()
    // 不是 admin -> 回首頁
    res.redirect('/')
  } else {
    // 沒登入 -> 回登入頁面
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

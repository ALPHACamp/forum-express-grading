const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 使用者是否有登入
  if (ensureAuthenticated(req)) {
    // 有登入，繼續往下走
    return next()
  }
  // 沒登入，把 user 丟回登入頁面
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // 使用者是否有登入
  if (ensureAuthenticated(req)) {
    // 有登入，使用者是否是 Admin？ 是 Admin，繼續往下走
    if (getUser(req).isAdmin) return next()
    // 不是 Admin，丟回首頁
    res.redirect('/')
  } else {
    // 沒登入，把 user 丟回登入頁面
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

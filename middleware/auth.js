const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  // 使用者是否有登入？
  if (ensureAuthenticated(req)) {
    // 有登入可以往下走
    return next()
  }
  //  沒有登入，把user丟回signin頁面
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    // 使用者是否為Admin? 是，可以往下走
    if (getUser(req).isAdmin) return next()
    // 不是，則丟回首頁
    res.redirect('/')
  } else {
    // 沒登入，丟回signin
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

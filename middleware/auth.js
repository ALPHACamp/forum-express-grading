const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 如果有登入
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // 如果有登入
  if (ensureAuthenticated(req)) {
    // 如果是管理員
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else { // 沒有登入
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

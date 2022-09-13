const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (isAuthenticated())
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next() // 驗證是否是Admin
    res.redirect('/') // 不是Admin
  } else { // 未登入
    res.redirect('/signin')
  }
}
module.exports = { authenticated, authenticatedAdmin }
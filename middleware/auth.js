const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next() // 驗證是否是Admin
    res.redirect('/') // 不是Admin
  } else { // 未登入
    res.redirect('/signin')
  }
}
module.exports = { authenticated, authenticatedAdmin }

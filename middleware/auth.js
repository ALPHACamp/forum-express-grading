const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 如果有登入
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // 如果有登入
  if (helpers.ensureAuthenticated(req)) {
    // 如果是管理員
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else { // 沒有登入
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

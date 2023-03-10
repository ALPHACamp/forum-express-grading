const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 使用這是否有登入?
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    // 有登入，可以往下走
    return next()
  }
  // 沒有，到signin
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    // 是admin可以往下走
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

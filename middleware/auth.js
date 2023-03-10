const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 是否有登入
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // 是否有登入
  if (helpers.ensureAuthenticated(req)) {
    // 是否是admin
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

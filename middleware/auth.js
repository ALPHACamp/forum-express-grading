const helpers = require('../helpers/auth-helper')


const authenticated = (req, res, next) => {
// 使用者是否可以登入?
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('signin')
}

const authenticatedAdmin = (req, res, next) => {
  // 使用者是否可以登入?
  if (helpers.ensureAuthenticated(req)) {
    // 使用者是否使Admin?
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.render('signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

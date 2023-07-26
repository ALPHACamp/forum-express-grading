const { ensureAuthenticated, getUser } = require('../helper/auth-helper')


const authenticated = (req, res, next) => {
// 使用者是否可以登入?
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('signin')
}

const authenticatedAdmin = (req, res, next) => {
  // 使用者是否可以登入?
  if (ensureAuthenticated(req)) {
    // 使用者是否使Admin?
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.render('signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

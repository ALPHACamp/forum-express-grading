const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 等同 if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    // 等同 if (req.user.isAdmin)
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

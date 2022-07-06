// Include modules
const helpers = require('../helpers/auth-helpers')

// Auth for normal user router
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  res.redirect('/signin')
}

// Auth for admin router
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
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

const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

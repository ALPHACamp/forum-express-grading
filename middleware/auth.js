const helpers = require('../helpers/auth-helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) return next()

      res.redirect('/')
    } else {
      res.redirect('/signin')
    }
  }
}

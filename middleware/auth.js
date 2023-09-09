const helpers = require('../helpers/auth-helper')

module.exports = {
  authenticated (req, res, next) {
    if (helpers.ensureAuthenticated(req)) next()
    else res.redirect('/signin')
  },
  authenticatedAdmin (req, res, next) {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) next()
      else res.redirect('/')
    } else res.redirect('/signin')
  }
}

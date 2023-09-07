const { getUser, ensureAuthenticated } = require('../helpers/auth-helper')

module.exports = {
  authenticated (req, res, next) {
    if (ensureAuthenticated(req)) next()
    else res.redirect('/signin')
  },
  authenticatedAdmin (req, res, next) {
    if (ensureAuthenticated(req)) {
      if (getUser(req).isAdmin) next()
      else res.redirect('/')
    } else res.redirect('/signin')
  }
}

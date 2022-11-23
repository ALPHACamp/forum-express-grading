const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')
module.exports = {
  authenticated: (req, res, next) => {
    if (ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (ensureAuthenticated(req)) {
      if (getUser(req).isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    return res.redirect('/signin')
  }
}

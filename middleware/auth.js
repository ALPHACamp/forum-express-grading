const helper = require('../helpers/auth-helpers')
module.exports = {
  authenticated: (req, res, next) => {
    if (helper.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helper.ensureAuthenticated(req)) {
      if (helper.getUser(req).isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    return res.redirect('/signin')
  }
}

const authHelper = require('./auth-helpers')

const authenticated = (req, res, next) => {
  if (authHelper.ensureAuthenticated(req)) {
    return next()
  }
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (authHelper.ensureAuthenticated(req)) {
    if (authHelper.getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

module.exports = { authenticated, authenticatedAdmin }

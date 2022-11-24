const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) return next()
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated) {
    if (getUser(req).isAdmin) return next()
    return res.redirect('/')
  } else {
    return res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

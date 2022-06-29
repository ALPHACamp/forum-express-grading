const { ensureAuthenticated, getUser } = require('../helpers/auth-helper')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) {
      return next()
    }
    res.redirect('/')
  }
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

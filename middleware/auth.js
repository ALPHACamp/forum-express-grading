const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) return next()
  res.redirect('/signin')
}
const authenticateAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticateAdmin
}

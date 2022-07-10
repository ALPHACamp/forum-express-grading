const helps = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helps.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helps.ensureAuthenticated(req)) {
    if (helps.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

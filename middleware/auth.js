const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
const authenticatedUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getParam(req).id.toString() === helpers.getUser(req).id.toString()) return next()
    res.redirect(`/users/${helpers.getUser(req).id}`)
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}

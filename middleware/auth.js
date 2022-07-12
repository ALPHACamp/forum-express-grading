const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
const authenticatedLimit = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) { return next() }
  req.flash('error_messages', '你沒有權限存取')
  res.redirect('back')
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedLimit
}

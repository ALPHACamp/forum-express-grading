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

const currentUserIsUser = (req, res, next) => {
  return req.user.id === Number(req.params.id) ? next() : res.redirect('/')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  currentUserIsUser
}

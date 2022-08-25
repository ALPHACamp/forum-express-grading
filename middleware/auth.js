<<<<<<< HEAD
const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
=======
const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
>>>>>>> R01
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
<<<<<<< HEAD
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
=======
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
>>>>>>> R01
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

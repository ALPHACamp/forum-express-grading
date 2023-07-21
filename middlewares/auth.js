const { getUser, ensureAuthenticated } = require('../helper/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    next()
  } else {
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) {
      next()
    } else {
      res.redirect('/restaurants')
    }
  } else {
    res.redirect('/signin')
  }
}

module.exports = { authenticated, authenticatedAdmin }

const helper = require('../helper/auth-helpers')

const authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    return next()
  } else {
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    if (helper.getUser(req).isAdmin) {
      return next()
    } else {
      res.redirect('/restaurants')
    }
  } else {
    res.redirect('/signin')
  }
}

module.exports = { authenticated, authenticatedAdmin }

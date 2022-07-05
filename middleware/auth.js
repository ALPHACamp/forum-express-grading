const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    res.redirect('/')
  }
  res.redirect('/signin')
}

const authenticatedOwner = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) {
    return next()
  }
  req.flash('error_messages', '只有帳號擁有者才能存取。')
  res.redirect('back')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedOwner
}

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
const authenticatedOwner = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) {
    return next()
  }
  req.flash('error_messages', '網頁存取失敗')
  res.redirect('/users/' + req.user.id)
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedOwner
}


const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    console.log('next')
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    return res.redirect('/')
  }
  return res.redirect('/signin')
}
// 判斷本人權限
const authenticatedSelf = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    console.log('go')
    if (helpers.getUser(req).id === Number(req.params.id)) return next()
    res.redirect(`/users/${req.params.id}`)
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedSelf
}

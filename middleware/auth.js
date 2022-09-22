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

const userAuthenticated = (req, res, next) => {
  if (!helpers.ensureAuthenticated(req)) return res.redirect('/signin')

  if (Number(req.params.id) === helpers.getUser(req).id) return next()
  throw new Error('您不是本人，無法操作')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  userAuthenticated
}

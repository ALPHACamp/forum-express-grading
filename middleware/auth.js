const helps = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (helps.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helps.ensureAuthenticated(req)) {
    if (helps.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

const authenticatedUser = (req, res, next) => {
  if (helps.ensureAuthenticated(req)) {
    if (helps.getUser(req).id === Number(req.params.id)) return next()
    throw new Error('非此使用者無法編輯！')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}

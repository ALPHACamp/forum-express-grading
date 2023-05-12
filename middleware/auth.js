const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) return next()

  req.flash('error_messages', '請先登入!')
  res.redirect('/signin')
}

const adminAuthenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) {
      return next()
    }
    res.redirect('/')
  } else {
    req.flash('error_messages', '請先登入!')
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  adminAuthenticated
}

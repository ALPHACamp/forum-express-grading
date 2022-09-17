const helper = require('../helpers/auth-helper')

exports.authenticated = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) return next()
  req.flash('error_messages', '請先登入再繼續')
  return res.redirect('/signin')
}

exports.authenticatedAdmin = (req, res, next) => {
  if (helper.ensureAuthenticated(req)) {
    if (helper.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

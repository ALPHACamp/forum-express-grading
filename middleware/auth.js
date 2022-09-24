const helpers = require('../helpers/auth-helpers')

exports.authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  req.flash('error_messages', '請先登入再繼續')
  return res.redirect('/signin')
}

exports.authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

exports.authenticatedUser = (req, res, next) => {
  const { userId } = req.params
  if (helpers.getUser(req).id === Number(userId)) return next()
  req.flash('error_messages', '沒有使用者權限')
  return res.redirect('/')
}

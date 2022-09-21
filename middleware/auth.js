
const helpers = require('../helpers/auth-helper')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  req.flash('error_messages', '請先進行登入')
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  // 是否有登入
  if (helpers.ensureAuthenticated(req)) {
    // 是否是管理者
    if (helpers.getUser(req).isAdmin) return next()

    return res.redirect('/restaurants')
  }
  req.flash('error_messages', '請先進行登入')
  res.redirect('/signin')
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

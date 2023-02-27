const helpers = require('../helpers/auth-helpers')
//! 定義驗證一般使用者與管理員的認證middleware
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  req.flash('warning_messages', '需先登入才能使用!')
  return res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next() //! 若為管理員則繼續往後走
    return res.redirect('/restaurants')
  }
  req.flash('warning_messages', '需先登入才能使用!')
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

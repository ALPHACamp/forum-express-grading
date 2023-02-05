const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')
//! 定義驗證一般使用者與管理員的認證middleware
const authenticated = (req, res, next) => {
  if (ensureAuthenticated) return next()
  return res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated) {
    if (getUser(req).isAdmin) return next() //! 若為管理員則繼續往後走
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

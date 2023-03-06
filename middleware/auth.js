const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedOwner = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).id === Number(req.params.id)) { // 對比已登入的使用者ID與嘗試編輯的使用者ID是否一致
      return next()
    }
  }
  req.flash('error_messages', '用戶只有編輯自有帳戶的權限 : 已跳轉至自有帳戶 !')
  res.redirect(`/users/${helpers.getUser(req).id}`)
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

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedOwner
}

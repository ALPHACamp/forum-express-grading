const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 使用者是否登入
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // 使用者是否為 ADMIN
  if (ensureAuthenticated(req)) {
    // 使用者是 ADMIN
    if (getUser(req).isAdmin) return next()
    // 使用者不是 ADMIN
    res.redirect('/')
  } else {
    // 使用者沒登入
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

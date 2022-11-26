const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

// 判斷使用者是否登入
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

// 判斷使用者是否登入>是否為管理者
const authenticatedAdmin = (req, res, next) => {
  // if isAuthenticated
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 是否有登入
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/login') // 丟回登入頁
}

const authenticatedAdmin = (req, res, next) => {
  // 是否有登入
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next() // isAdmin 為 true（是admin）可以繼續
    res.redirect('/') // 不是admin，丟回首頁
  } else {
    res.redirect('/login')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // 是否有登入
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin') // 丟回登入頁
}

const authenticatedAdmin = (req, res, next) => {
  // 是否有登入
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next() // isAdmin 為 true（是admin）可以繼續
    res.redirect('/') // 不是admin，丟回首頁
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

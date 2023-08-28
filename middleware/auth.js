// const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) { // 驗證使用者 // 將此行 驗證使用者功能 外包成 helpers 做管理
    if (helpers.getUser(req).isAdmin) return next() // 如果撈到的使用者 isAdmin=true，就 return 下一步
    res.redirect('/') // 否則就回首頁
  } else {
    res.redirect('/signin') // 如果撈不到使用者（沒有登入），就回去 signin 頁面
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

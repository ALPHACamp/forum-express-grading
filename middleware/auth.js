// const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
helpers = require('../helpers/auth-helpers')

// 一般會員
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  // if (ensureAuthenticated(req)) {
  if (helpers.ensureAuthenticated(req)) { // 如果有登入
    return next() // 執行下一個middleware
  }
  res.redirect('/signin') // 沒登入退回登入頁面
}

// adm
const authenticatedAdmin = (req, res, next) => {
  // if (ensureAuthenticated(req)) {
  //   if (getUser(req).isAdmin) return next()
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next() // getUser回傳的檔案若是adm執行下一步
    res.redirect('/')
  } else {
    res.redirect('/signin') // 沒登入回登入頁面
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

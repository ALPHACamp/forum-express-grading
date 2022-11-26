// 在這裡做auth-helpers的細部驗證(middleware)，然後放回路由中執行
// 導出
const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 是否有成功登入(在未登入的狀況下，不能使用網頁的其他功能)
  // req傳入的(你點選的)有成功驗證，則next()
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

// 繼續驗證是否為管理者
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    // getUser的isAdmin為true，則next()
    if (helpers.getUser(req).isAdmin) return next()
    // 若不是admin則導向主頁
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

// 引入方法
const helpers = require('../helpers/auth-helpers')

// 確認是否有登入
const authenticated = (req, res, next) => {
  // 判斷是否有登入
  if (helpers.ensureAuthenticated(req)) {
    // 有登入，進入下一個路由
    return next()
  }

  // 沒有登入，導向登入頁面
  res.redirect('/signin')
}

// 確認是否有admin權限
const authenticatedAdmin = (req, res, next) => {
  // 判斷是否有登入
  if (helpers.ensureAuthenticated(req)) {
    // 有登入再判斷登入者是否具有admin權限，若有進入下一路由
    if (helpers.getUser(req).isAdmin) return next()

    // 若沒有admin權限，回到前台首面
    res.redirect('/')
  } else {
    // 若沒登入，導向登入頁面
    res.redirect('/signin')
  }
}

// 匯出模組
module.exports = {
  authenticated,
  authenticatedAdmin
}

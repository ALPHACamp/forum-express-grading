const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

// 01、檢查使用者是否有登入
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    // 從ensureAuthenticated中獲取true或false，來驗證使用者是否成功登入

    return next() // 如果是true的話接續下去(這裡是moddleware)
  }
  res.redirect('/signin') // 如果是false的話，回到登入頁面
}

// 02、驗證是否為管理者身分
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    // 先驗證是否登入，才繼續下去
    if (getUser(req).isAdmin) return next() // 資料庫有isAdmin的欄位，因此我可使用.isAdmin來查看true或false
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

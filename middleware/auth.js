// 這裡的中間件為驗證使用者開放進入內部頁面或後台頁面
const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

// 驗證使用者是否登入中間件，放行有登入的使用者
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

// 驗證登入是否為管理者流程，只放行有登入且是管理者
// 在某些後台頁面才需要特別驗證是否為管理者就需要設置此中間件，一般的登入頁面則不用
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next() // 是管理員 丟給下一個中間件
    res.redirect('/') // 不是管理員 返回首頁
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

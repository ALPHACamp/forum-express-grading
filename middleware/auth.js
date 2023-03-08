const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated) 有登入則繼續 沒登入則丟回登入頁面
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated) 有登入 是否為admin,對則往前,錯則回首頁
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
const authenticatedProfile = (req, res, next) => { // 檢查登入與欲編輯使用者是否一樣
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).id === Number(req.params.id)) {
      return next()
    }
    throw new Error('user only edit on yourself.')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedProfile
}

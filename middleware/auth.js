const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 判斷user登入狀態，有登入可以return next()，沒登入把user轉回到signin頁面
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  req.flash('error_messages', 'Please sign in!')
  res.redirect('/signin')
}

// 判斷user是否為admin身分，先判斷登入狀態，有登入，判斷user是否為admin，是admin可以往下走，不是admin丟回首頁，沒登入就轉回登入頁面
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

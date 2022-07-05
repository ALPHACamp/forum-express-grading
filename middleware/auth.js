const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) { // 如果有登入，繼續
    return next()
  }
  res.redirect('/signin') // 如果沒登入，丟回登入頁
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) { // 如果有登入，繼續
    if (getUser(req).isAdmin) { // 如果有登入且為admin，繼續
      return next()
    }
    res.redirect('/') // 如果有登入但不是admin，丟回首頁
  } else {
    res.redirect('/signin') // 如果沒登入，丟回登入頁
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}

const helpers = require('../helpers/auth-helpers')
module.exports = {
  authenticated: (req, res, next) => {
    return (helpers.ensureAuthenticated(req)) ? next() : res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) return next() // isAdmin 為 true（是admin）可以繼續
      res.redirect('/') // 不是admin，丟回首頁
    } else {
      res.redirect('/signin')
    }
  }
}

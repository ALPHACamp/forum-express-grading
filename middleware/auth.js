// const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 使用者是否登入
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // 使用者是否為 ADMIN
  if (helpers.ensureAuthenticated(req)) {
    // 使用者是 ADMIN
    if (helpers.getUser(req).isAdmin) return next();
    // 使用者不是 ADMIN
    res.redirect("/");
  } else {
    // 使用者沒登入
    res.redirect("/signin");
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}

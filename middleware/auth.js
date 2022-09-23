const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) { // 使用者是否有登入
    return next() // 有登入 -> 往下
  }
  res.redirect('/signin') // 沒有 -> 重新倒回 signin
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
const authenticateUser = (req, res, next) => {
  const id = Number(req.params.id)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).id === id) return next()
    res.redirect(`/users/${id}`)
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticateUser
}

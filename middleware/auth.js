
const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  req.flash('error_messages', '請先進行登入')
  res.redirect('/signin')
}

const authenticatedUser = (req, res, next) => {
  const id = Number(req.params.id)
  const currentUser = helpers.getUser(req)
  if (id !== currentUser.id) throw new Error('You can\'t look other user profile')
  next()
}

const authenticatedAdmin = (req, res, next) => {
  // 是否有登入
  if (helpers.ensureAuthenticated(req)) {
    // 是否是管理者
    if (helpers.getUser(req).isAdmin) return next()

    return res.redirect('/restaurants')
  }
  req.flash('error_messages', '請先進行登入')
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}

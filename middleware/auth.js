const helpers = require('../helpers/auth-helpers')


const authenticated = (req, res, next) => {
// 使用者是否可以登入?
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('signin')
}

const authenticatedAdmin = (req, res, next) => {
  // 使用者是否可以登入?
  if (helpers.ensureAuthenticated(req)) {
    // 使用者是否使Admin?
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.render('signin')
  }
}

const authenticatedProfile = (req, res, next) => {
  if (helpers.getUser(req).id !== Number(req.params.id)) {
    req.flash('error_messages', "Profile didn't exist")
    return res.redirect(`/users/${helpers.getUser(req).id}`)
  }
  next()
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedProfile
}

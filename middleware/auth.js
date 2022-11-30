const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

const authenticatedUser = (req, res, next) => {
  const userProfileId = req.params.id
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).id === Number(userProfileId)) return next() // 使用者看不到其他user的edit頁面
    req.flash('error_messages', 'You can only edit your own profile.')
    res.redirect(`/users/${userProfileId}`)
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}

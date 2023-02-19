const { getUser } = require('../helpers/auth-helpers')
module.exports = {
  authenticated: (req, res, next) => {
    return (req.isAuthenticated()) ? next() : res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    const user = getUser(req)
    user
      ? (user.isAdmin) ? next() : res.redirect('/')
      : res.redirect('/signin')
  }
}

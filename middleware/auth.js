module.exports = {
  authenticated: (req, res, next) => {
    return (req.isAuthenticated()) ? next() : res.redirect('/signin')
  }
}

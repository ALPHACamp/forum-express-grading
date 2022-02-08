module.exports = {
  getUser: req => {
    return req.user || null
  },
  ensureAuthenticated: req => {
    return req.isAuthenticated()
  }
}

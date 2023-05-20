const getCurrentUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getCurrentUser,
  ensureAuthenticated
}

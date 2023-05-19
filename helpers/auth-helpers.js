const getUser = req => {
  return req.user || null
}

const ensureAuththenticated = req => {
  return req.isAuthenticated()
}

module.exports = { getUser, ensureAuththenticated }

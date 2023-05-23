const getUser = req => {
  return req.user || null
}

// return true or false
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

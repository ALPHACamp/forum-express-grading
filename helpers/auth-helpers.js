const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

exports = module.exports = {
  getUser,
  ensureAuthenticated
}

const getUser = req => {
  return req.user || null
}

const getParam = req => {
  return req.params || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  getParam,
  ensureAuthenticated
}

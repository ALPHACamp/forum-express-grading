const getUser = req => {
  return req.user || null
}
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

const userAuth = (paramsId, userId) => {
  return Number(paramsId) === userId
}

module.exports = {
  getUser,
  ensureAuthenticated,
  userAuth
}

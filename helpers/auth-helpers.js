const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  // console.log('就是進到這了嗎', req.isAuthenticated())
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

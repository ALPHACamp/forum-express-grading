const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  console.log('是不是一直進到這？', req.isAuthenticated())
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

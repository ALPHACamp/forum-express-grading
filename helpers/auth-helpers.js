const getUser = req => {
  return req.user || null // 等同於 condition ? value1 : value2
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

const getUser = req => {
  return req.user || null
}
// 加入驗證機制
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

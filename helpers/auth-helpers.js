//  處理各種使用者身份驗證
const getUser = req => {
  return req.user || null
}
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

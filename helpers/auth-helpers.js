const getUser = req => {
  return req.user || null
}
// 使用者身分驗證
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated
}

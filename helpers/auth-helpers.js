const getUser = req => {
  return req.user || null
}
// 新增這段驗證使用者身分
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated // 新增這裡
}

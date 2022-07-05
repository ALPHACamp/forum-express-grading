const getUser = req => {
  return req.user || null
}
// 新增這裡
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated // 新增這裡
}

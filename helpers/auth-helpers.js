const getUser = req => {
  return req.user || null // 等於-> req.user ? req.user : null
}
// 將判斷登入寫在這邊再導出
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

const getUser = req => {
  return req.user || null // 等價於req.user ? req.user : null
}

// 登入判斷驗證
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

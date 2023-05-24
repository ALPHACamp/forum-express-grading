const getUser = req => {
  return req.user || null // 若 req.user 存在就回傳 req.user 不然就回傳 空值
}

const ensureAuthenticated = req => {
  return req.isAuthenticated() // 用Passport 的驗證功能確認身分
}

module.exports = {
  getUser,
  ensureAuthenticated
}

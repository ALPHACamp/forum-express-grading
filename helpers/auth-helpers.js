// 回傳user物件實侁
const getUser = req => {
  return req.user || null
}

// 回傳是isAuthenticated
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

// 匯出模組
module.exports = {
  getUser,
  ensureAuthenticated
}

// 負責管理使用者驗證

// 確定有撈到使用者
const getUser = req => {
  return req.user || null
}

// 驗證使用者的機制
const ensureAuthenticated = req => {
  return req.isAuthenticated() // isAuthenticated: 驗證此使用者
}

module.exports = {
  getUser,
  ensureAuthenticated
}

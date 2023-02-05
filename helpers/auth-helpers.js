//! 管理驗證user的function
const getUser = req => {
  return req.user || null
}
const ensureAuthenticated = req => {
  return req.isAuthenticated() // - 將passport提供的方法包裝起來
}
module.exports = {
  getUser,
  ensureAuthenticated
}

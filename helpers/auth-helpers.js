
const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
} // 用來驗證使用者是否已經登入，回傳true或false

module.exports = {
  getUser,
  ensureAuthenticated
}

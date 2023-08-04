// 負責管理使用者驗證
const getUser = req => {
  return req.user || null
}
module.exports = {
  getUser
}

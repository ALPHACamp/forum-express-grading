//  處理各種使用者身份驗證
const getUser = req => {
  return req.user || null
}
module.exports = {
  getUser
}

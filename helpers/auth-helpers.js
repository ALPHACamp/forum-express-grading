// 專門來幫我們處理各種和使用者身分驗證相關的事情，目的為權責分離

const getUser = req => {
  return req.user || null
// 寫法和 req.user ? req.user : null 是等價的，意思是若 req.user 存在就回傳 req.user，不存在的話函式就會回傳空值。
}
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated
}

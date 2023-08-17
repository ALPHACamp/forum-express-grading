const getUser = req => { // 取得user 會拿到user資料
  return req.user || null
}
const ensureAuthenticated = req => { // 驗證req是否登入狀態
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated
}

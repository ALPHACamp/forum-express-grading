const getUser = req => {
  return req.user || null // req.user存在就回傳req.user，不存在則回傳空值
}
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}
module.exports = {
  getUser,
  ensureAuthenticated
}

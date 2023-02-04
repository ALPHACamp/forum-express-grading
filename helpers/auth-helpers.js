//! 管理驗證user的function
const getUser = req => {
  return req.user || null
}
module.exports = {
  getUser
}

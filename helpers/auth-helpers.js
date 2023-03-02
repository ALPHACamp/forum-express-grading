const getUser = req => {
  return req.user || null  // 等同於 req.user ? req.user : null
}
module.exports = {
  getUser
}
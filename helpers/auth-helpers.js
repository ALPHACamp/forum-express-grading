const getUser = req => {
  return req.user || null // 等價於req.user ? req.user : null
}
module.exports = {
  getUser
}

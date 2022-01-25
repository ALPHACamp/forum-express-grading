const getUser = req => {
  return req.user ? req.user : null
}
module.exports = {
  getUser
}

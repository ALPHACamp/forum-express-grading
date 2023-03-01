// helpers/auth-helpers.js
const getUser = req => {
  return req.user || null
}
module.exports = {
  getUser
}

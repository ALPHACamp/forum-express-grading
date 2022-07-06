// auth-helpers.js
// deals with all stuff about user authentication then return the value to other files
// benefit: if any methods of the dependencies changed, just rewrite those methods here
const getUser = req => {
  return req.user || null
  // = req.user ? req.user : null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}
const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

// same as above
// module.exports = {
//   getUser: req => {
//     return req.user || null
//   }
// }

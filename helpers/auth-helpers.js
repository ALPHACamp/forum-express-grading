// 原本這樣寫
// const authHelpers = {
//   getUser: req => {
//     return req.user || null
//   }
// }

// module.exports = authHelpers

const getUser = req => {
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = { getUser, ensureAuthenticated }

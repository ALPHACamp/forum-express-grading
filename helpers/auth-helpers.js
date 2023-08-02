// 用來取得認證後的資料
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

// 我比較喜歡這樣寫
// const auth = {
//   getUser: req => { return req.user || null },
//   ensureAuthenticated: req => { return req.isAuthenticated() }
// }
// module.exports = auth

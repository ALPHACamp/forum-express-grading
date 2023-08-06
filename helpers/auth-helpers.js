const getUser = req => {
  // req.user ? req.user : null
  // 若 req.user 存在就回傳 req.user，不存在的話函式就會回傳空值
  return req.user || null
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}

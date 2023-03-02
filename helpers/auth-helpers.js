module.exports = {
  getUser: req => {
    if (req.user) {
      const { password, ...userUpdate } = req.user
      return userUpdate // 將password從回傳的user物件移除
    } else {
      return null
    }
  },
  ensureAuthenticated: req => {
    return req.isAuthenticated()
  }
}

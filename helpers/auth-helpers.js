// 回傳user物件實侁
const getUser = req => {
  return req.user || null
}

// 匯出模組
module.exports = {
  getUser
}

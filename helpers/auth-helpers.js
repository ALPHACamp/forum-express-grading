const getUser = req => {
  return req.user || null // 若 req.user 存在就回傳 req.user，不存在的話函式就會回傳空值
}
module.exports = {
  getUser
}

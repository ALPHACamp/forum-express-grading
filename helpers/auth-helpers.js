const getUser = req => {
  return req.user || null // 若 req.user 存在就回傳 req.user 不然就回傳 空值
}
module.exports = {
  getUser
}
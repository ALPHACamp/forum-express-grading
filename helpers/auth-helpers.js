// 讓程式的權責更分離，專門處理各種和使用者身份驗證相關的事情
// 把 req.user 再包裝成一支 getUser 函式並導出
const getUser = req => {
  return req.user || null // 若 req.user 存在就回傳 req.user，不存在的話函式就會回傳空值
}

module.exports = {
  getUser
}

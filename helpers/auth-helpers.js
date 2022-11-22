// 處理各種和使用者身分驗證相關的事情：萬一 Passport 套件的設定有調整，這個 req.user的寫法可能會需要改變。此時，比起回來修改主程式 app.js，如果有一個獨立的地方是負責管理使用者驗證的，在維護上會更直覺、更獨立。
// 別忘了回到 app.js，把剛剛做好的 auth-helpers.js 引入

const getUser = req => {
  return req.user || null
  // 注意到 return 這邊最後面多了一個 || null，這個寫法和 req.user ? req.user : null 是等價的，意思是若 req.user 存在就回傳 req.user，不存在的話函式就會回傳空值。
}
module.exports = {
  getUser
}

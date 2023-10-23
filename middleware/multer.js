const multer = require('multer') // 將multer 載進來

// 呼叫 multer 套件提供的方法，上傳的圖片會暫存到 temp 這個臨時資料夾中
const upload = multer({ dest: 'temp/' })

module.exports = upload // upload 後導出

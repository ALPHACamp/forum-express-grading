const multer = require('multer')

const upload = multer({ dest: 'temp/' }) // 呼叫了 multer 套件提供的方法，用參數設定使用者上傳的圖片會暫存到 temp 這個臨時資料夾中

module.exports = upload
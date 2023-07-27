const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 用參數設定圖片會暫存到temp這個資料夾中

module.exports = upload

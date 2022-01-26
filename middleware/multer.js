// 引入multer
const multer = require('multer')
// 呼吸multer方法，參數設定使用者上傳的圖片會暫存到 temp 這個臨時資料夾中
const upload = multer({ dest: 'temp/' })

// 匯出模組
module.exports = upload

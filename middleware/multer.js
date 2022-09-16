const multer = require('multer')
const upload = multer({ dest: 'temp/' }) // 目的地：temp 資料夾
// 在 multer 用參數設定 -> 使用者上傳圖片會暫存在 temp 臨時資料夾中，存放在 upload 變數中最後 export 給其他檔案使用

module.exports = upload

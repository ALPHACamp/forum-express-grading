const multer = require('multer')// 把 multer 載進來
// 呼叫了 multer 套件提供的方法，用參數設定使用者上傳的圖片會暫存到 temp 這個臨時資料夾中
const upload = multer({ dest: 'temp/' })
// 把這個方法存成 upload 後導出
module.exports = upload
